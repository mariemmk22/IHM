const { Avis, Note, Commentaire, RendezVous, Service, Client, Prestataire } = require("../models");

function normalizeAvisForClient(item) {
	const providerProfile = item.rendezVous?.prestataire?.client;

	return {
		idAvis: item.idAvis,
		dateAvis: item.dateAvis,
		rating: item.note?.nbstart ?? 0,
		comment: item.commentaire?.description ?? "",
		rendezVousId: item.rendezVousId,
		service: item.rendezVous?.service
			? {
					id: item.rendezVous.service.idService,
					nomService: item.rendezVous.service.nomService,
					region: item.rendezVous.service.region,
					prix: item.rendezVous.service.prix,
				}
			: null,
		prestataire: item.rendezVous?.prestataire
			? {
					id: item.rendezVous.prestataire.id,
					nom: providerProfile?.nom ?? "",
					prenom: providerProfile?.prenom ?? "",
					specialite: item.rendezVous.prestataire.specialite,
				}
			: null,
	};
}

async function findAvisByClientId(clientId) {
	const avis = await Avis.findAll({
		where: { clientId: Number(clientId) },
		include: [
			{
				model: RendezVous,
				as: "rendezVous",
				include: [
					{
						model: Service,
						as: "service",
						attributes: ["idService", "nomService", "region", "prix"],
					},
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
				model: Note,
				as: "note",
			},
			{
				model: Commentaire,
				as: "commentaire",
			},
		],
		order: [["dateAvis", "DESC"]],
	});

	return avis.map(normalizeAvisForClient);
}

// Voir les avis d'un service
exports.getByService = async (req, res) => {
	try {
		const { serviceId } = req.params;

		const avis = await Avis.findAll({
			include: [
				{
					model: RendezVous,
					as: "rendezVous",
					where: { serviceId: Number(serviceId) },
					include: [
						{
							model: Service,
							as: "service",
							attributes: ["idService", "nomService", "region", "prix"],
						},
						{
							model: Client,
							as: "client",
							attributes: ["id", "nom", "prenom"],
						},
					],
				},
				{
					model: Note,
					as: "note",
				},
				{
					model: Commentaire,
					as: "commentaire",
				},
			],
			order: [["dateAvis", "DESC"]],
		});

		const normalized = avis.map((item) => ({
			idAvis: item.idAvis,
			dateAvis: item.dateAvis,
			rating: item.note?.nbstart ?? 0,
			comment: item.commentaire?.description ?? "",
			rendezVousId: item.rendezVousId,
			service: item.rendezVous?.service
				? {
						id: item.rendezVous.service.idService,
						nomService: item.rendezVous.service.nomService,
						region: item.rendezVous.service.region,
						prix: item.rendezVous.service.prix,
					}
				: null,
			client: item.rendezVous?.client
				? {
						id: item.rendezVous.client.id,
						nom: item.rendezVous.client.nom,
						prenom: item.rendezVous.client.prenom,
					}
				: null,
		}));

		res.status(200).json(normalized);
	} catch (error) {
		res.status(500).json({
			message: "Erreur lors de la récupération des avis",
			error: error.message,
		});
	}
};

// Voir les avis donnés par un client
exports.getByClient = async (req, res) => {
	try {
		const { clientId } = req.params;

		const normalized = await findAvisByClientId(clientId);

		res.status(200).json(normalized);
	} catch (error) {
		res.status(500).json({
			message: "Erreur lors de la récupération des avis",
			error: error.message,
		});
	}
};

// Voir les avis du client authentifié
exports.getMine = async (req, res) => {
	try {
		if (!req.user?.id) {
			return res.status(401).json({ message: "Utilisateur non authentifié" });
		}

		const normalized = await findAvisByClientId(req.user.id);

		res.status(200).json(normalized);
	} catch (error) {
		res.status(500).json({
			message: "Erreur lors de la récupération des avis",
			error: error.message,
		});
	}
};

// Voir les avis reçus par un prestataire
exports.getByPrestataire = async (req, res) => {
	try {
		const { prestataireId } = req.params;

		const avis = await Avis.findAll({
			include: [
				{
					model: RendezVous,
					as: "rendezVous",
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
							attributes: ["id", "nom", "prenom"],
						},
					],
				},
				{
					model: Note,
					as: "note",
				},
				{
					model: Commentaire,
					as: "commentaire",
				},
			],
			order: [["dateAvis", "DESC"]],
		});

		const normalized = avis.map((item) => ({
			idAvis: item.idAvis,
			dateAvis: item.dateAvis,
			rating: item.note?.nbstart ?? 0,
			comment: item.commentaire?.description ?? "",
			rendezVousId: item.rendezVousId,
			service: item.rendezVous?.service
				? {
						id: item.rendezVous.service.idService,
						nomService: item.rendezVous.service.nomService,
						region: item.rendezVous.service.region,
						prix: item.rendezVous.service.prix,
					}
				: null,
			client: item.rendezVous?.client
				? {
						id: item.rendezVous.client.id,
						nom: item.rendezVous.client.nom,
						prenom: item.rendezVous.client.prenom,
					}
				: null,
		}));

		res.status(200).json(normalized);
	} catch (error) {
		res.status(500).json({
			message: "Erreur lors de la récupération des avis",
			error: error.message,
		});
	}
};

// Créer un avis depuis le client
exports.createAvis = async (req, res) => {
	try {
		const { rendezVousId, nbstart, comment } = req.body;
		console.log("[createAvis] payload:", req.body);

		if (!rendezVousId || !nbstart) {
			return res.status(400).json({ message: "Champs obligatoires manquants" });
		}

		const rendezVous = await RendezVous.findByPk(Number(rendezVousId));
		if (!rendezVous) {
			return res.status(404).json({ message: "Rendez-vous introuvable" });
		}
		console.log("[createAvis] rendezVous found:", rendezVous.idRendezVous);

		if (!req.user || String(req.user.id) !== String(rendezVous.clientId)) {
			return res.status(403).json({ message: "Accès refusé" });
		}

		const existingAvis = await Avis.findOne({ where: { rendezVousId: Number(rendezVousId) } });
		if (existingAvis) {
			return res.status(409).json({ message: "Un avis existe déjà pour ce rendez-vous" });
		}

		const tx = await Avis.sequelize.transaction();
		let avis;
		let note;
		let commentaire;
		try {
			avis = await Avis.create({
				clientId: Number(req.user.id),
				rendezVousId: Number(rendezVousId),
			}, { transaction: tx });

			note = await Note.create({
				avisId: avis.idAvis,
				nbstart: Number(nbstart),
			}, { transaction: tx });

			commentaire = await Commentaire.create({
				avisId: avis.idAvis,
				description: comment ?? "",
			}, { transaction: tx });

			await tx.commit();
		} catch (innerError) {
			await tx.rollback();
			throw innerError;
		}

		res.status(201).json({
			message: "Avis créé avec succès",
			avis: {
				idAvis: avis.idAvis,
				dateAvis: avis.dateAvis,
				rating: note.nbstart,
				comment: commentaire.description,
				rendezVousId: avis.rendezVousId,
			},
		});
	} catch (error) {
		console.error("[createAvis] error:", error.name, error.message);
		if (error.parent && error.parent.sqlMessage) {
			console.error("[createAvis] sql:", error.parent.sqlMessage);
		}
		res.status(500).json({
			message: "Erreur lors de la création de l'avis",
			error: error.message,
		});
	}
};
