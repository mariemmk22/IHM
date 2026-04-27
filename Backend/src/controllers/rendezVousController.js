const { RendezVous, Service, Client, Prestataire } = require("../models");

// Voir les rendez-vous d'un prestataire
exports.getByPrestataire = async (req, res) => {
	try {
		const { prestataireId } = req.params;

		if (!req.user || req.user.role !== "prestataire" || String(req.user.prestataireId) !== String(prestataireId)) {
			return res.status(403).json({ message: "Accès refusé" });
		}

		const rendezVous = await RendezVous.findAll({
			where: { prestataireId: Number(prestataireId) },
			include: [
				{
					model: Service,
					as: "service",
					attributes: ["idService", "nomService", "region", "prix"],
				},
				{
					model: Client,
					as: "client",
					attributes: ["id", "nom", "prenom", "telephone", "region"],
				},
			],
			order: [["dateRdv", "DESC"], ["heureRdv", "DESC"]],
		});

		const normalized = rendezVous.map((item) => ({
			id: item.idRendezVous,
			dateRdv: item.dateRdv,
			heureRdv: item.heureRdv,
			adresseIntervention: item.adresseIntervention,
			description: item.description,
			statut: item.statut,
			service: item.service
				? {
						id: item.service.idService,
						nomService: item.service.nomService,
						region: item.service.region,
						prix: item.service.prix,
					}
				: null,
			client: item.client
				? {
						id: item.client.id,
						nom: item.client.nom,
						prenom: item.client.prenom,
						telephone: item.client.telephone,
						region: item.client.region,
					}
				: null,
		}));

		res.status(200).json(normalized);
	} catch (error) {
		res.status(500).json({
			message: "Erreur lors de la récupération des rendez-vous",
			error: error.message,
		});
	}
};

// Voir les rendez-vous d'un client
exports.getByClient = async (req, res) => {
	try {
		const { clientId } = req.params;

		if (!req.user || String(req.user.id) !== String(clientId)) {
			return res.status(403).json({ message: "Accès refusé" });
		}

		const rendezVous = await RendezVous.findAll({
			where: { clientId: Number(clientId) },
			include: [
				{
					model: Service,
					as: "service",
					attributes: ["idService", "nomService", "region", "prix"],
					include: [
						{
							model: Prestataire,
							as: "prestataire",
							attributes: ["id", "specialite"],
							include: [
								{
									model: Client,
									as: "client",
									attributes: ["id", "nom", "prenom"],
								},
							],
						},
					],
				},
				{
					model: Client,
					as: "client",
					attributes: ["id", "nom", "prenom", "telephone", "region"],
				},
			],
			order: [["dateRdv", "DESC"], ["heureRdv", "DESC"]],
		});

		const normalized = rendezVous.map((item) => ({
			id: item.idRendezVous,
			dateRdv: item.dateRdv,
			heureRdv: item.heureRdv,
			adresseIntervention: item.adresseIntervention,
			description: item.description,
			statut: item.statut,
			service: item.service
				? {
						id: item.service.idService,
						nomService: item.service.nomService,
						region: item.service.region,
						prix: item.service.prix,
					}
				: null,
			client: item.client
				? {
						id: item.client.id,
						nom: item.client.nom,
						prenom: item.client.prenom,
						telephone: item.client.telephone,
						region: item.client.region,
					}
				: null,
		}));

		res.status(200).json(normalized);
	} catch (error) {
		res.status(500).json({
			message: "Erreur lors de la récupération des rendez-vous client",
			error: error.message,
		});
	}
};

// Créer un rendez-vous depuis le client
exports.createRendezVous = async (req, res) => {
	try {
		const { serviceId, dateRdv, heureRdv, adresseIntervention, description } = req.body;

		if (!serviceId || !dateRdv || !heureRdv || !adresseIntervention) {
			return res.status(400).json({ message: "Champs obligatoires manquants" });
		}

		const service = await Service.findByPk(Number(serviceId), {
			include: [
				{
					model: Prestataire,
					as: "prestataire",
				},
			],
		});

		if (!service) {
			return res.status(404).json({ message: "Service introuvable" });
		}

		if (!service.prestataireId) {
			return res.status(400).json({ message: "Ce service n'est rattaché à aucun prestataire" });
		}

		const rendezVous = await RendezVous.create({
			clientId: Number(req.user.id),
			prestataireId: Number(service.prestataireId),
			serviceId: Number(service.idService),
			dateRdv,
			heureRdv,
			adresseIntervention,
			description: description ?? null,
			statut: "en_attente",
		});

		res.status(201).json({
			message: "Rendez-vous créé avec succès",
			rendezVous: {
				id: rendezVous.idRendezVous,
				dateRdv: rendezVous.dateRdv,
				heureRdv: rendezVous.heureRdv,
				adresseIntervention: rendezVous.adresseIntervention,
				description: rendezVous.description,
				statut: rendezVous.statut,
				service: {
					id: service.idService,
					nomService: service.nomService,
				},
			},
		});
	} catch (error) {
		res.status(500).json({
			message: "Erreur lors de la création du rendez-vous",
			error: error.message,
		});
	}
};

// Mettre à jour le statut d'un rendez-vous
exports.updateStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { statut } = req.body;

		if (!["en_attente", "accepte", "annule"].includes(statut)) {
			return res.status(400).json({ message: "Statut invalide" });
		}

		const rendezVous = await RendezVous.findByPk(Number(id));
		if (!rendezVous) {
			return res.status(404).json({ message: "Rendez-vous introuvable" });
		}

		if (!req.user || req.user.role !== "prestataire" || String(req.user.prestataireId) !== String(rendezVous.prestataireId)) {
			return res.status(403).json({ message: "Accès refusé" });
		}

		await rendezVous.update({ statut });

		res.status(200).json({
			message: "Statut du rendez-vous mis à jour",
			rendezVous: {
				id: rendezVous.idRendezVous,
				statut: rendezVous.statut,
			},
		});
	} catch (error) {
		res.status(500).json({
			message: "Erreur lors de la mise à jour du rendez-vous",
			error: error.message,
		});
	}
};
