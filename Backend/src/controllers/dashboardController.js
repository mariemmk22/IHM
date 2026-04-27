const { Prestataire, Service, SousCategorie, RendezVous, Avis, Note, Commentaire, Client } = require("../models");

exports.getProviderDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const prestataireId = Number(id);

    console.log("Dashboard request:", { userId: req.user?.id, userRole: req.user?.role, userPrestataireId: req.user?.prestataireId, requestedId: id, convertedId: prestataireId });

    if (!req.user || req.user.role !== "prestataire" || String(req.user.prestataireId) !== String(id)) {
      console.log("Access denied:", { userRole: req.user?.role, userPrestataireId: req.user?.prestataireId, requestedId: id });
      return res.status(403).json({ message: "Accès refusé" });
    }

    console.log("Fetching services for prestataireId:", prestataireId);
    
    const [services, totalAppointments, recentAppointments, recentReviews, recommendedServices] = await Promise.all([
      Service.findAll({
        where: { prestataireId: prestataireId },
        include: [{ model: SousCategorie, as: "sousCategorie" }],
        order: [["createdAt", "DESC"]],
      }),
      RendezVous.count({ where: { prestataireId: prestataireId } }),
      RendezVous.findAll({
        where: { prestataireId: prestataireId },
        include: [
          {
            model: Service,
            as: "service",
            attributes: ["id", "nomService", "region", "prix"],
          },
          {
            model: Client,
            as: "client",
            attributes: ["id", "nom", "prenom"],
          },
        ],
        order: [["dateRdv", "DESC"], ["heureRdv", "DESC"]],
        limit: 4,
      }),
      Avis.findAll({
        include: [
          {
            model: RendezVous,
            as: "rendezVous",
            required: true,
            where: { prestataireId: prestataireId },
            include: [
              {
                model: Service,
                as: "service",
                attributes: ["id", "nomService"],
              },
            ],
          },
          {
            model: Note,
            as: "note",
            attributes: ["nbstart"],
          },
          {
            model: Commentaire,
            as: "commentaire",
            attributes: ["description"],
          },
          {
            model: Client,
            as: "client",
            attributes: ["id", "nom", "prenom"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: 4,
      }),
      Service.findAll({
        order: [["createdAt", "DESC"]],
        limit: 3,
      }),
    ]);

    const ratingValues = recentReviews
      .map((review) => review.note?.nbstart)
      .filter((rating) => typeof rating === "number");

    const ratingValue = ratingValues.length
      ? ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length
      : null;

    console.log("Dashboard data collected:", { 
      serviceCount: services.length, 
      services: services.map(s => ({ id: s.idService, nom: s.nomService })),
      totalAppointments, 
      ratingValue 
    });

    res.status(200).json({
      serviceCount: services.length,
      totalAppointments,
      averageRating: ratingValue ?? null,
      profileViews: totalAppointments * 5 + services.length * 8,
      recentServices: services.slice(0, 4).map((service) => ({
        id: service.idService,
        nomService: service.nomService,
        description: service.description,
        region: service.region,
        prix: service.prix,
        sousCategorie: service.sousCategorie ? { id: service.sousCategorie.idSousCategorie, nom: service.sousCategorie.nomSousCategorie } : undefined,
      })),
      recentAppointments: recentAppointments.map((appointment) => ({
        id: appointment.idRendezVous,
        dateRdv: appointment.dateRdv,
        heureRdv: appointment.heureRdv,
        adresseIntervention: appointment.adresseIntervention,
        statut: appointment.statut,
        service: appointment.service ? { nomService: appointment.service.nomService } : null,
        client: appointment.client ? { nom: appointment.client.nom, prenom: appointment.client.prenom } : null,
      })),
      recentReviews: recentReviews.map((review) => ({
        idAvis: review.idAvis,
        dateAvis: review.dateAvis,
        rating: review.note?.nbstart ?? 0,
        comment: review.commentaire?.description ?? "",
        service: review.rendezVous?.service ? { nomService: review.rendezVous.service.nomService } : null,
        client: review.client ? { nom: review.client.nom, prenom: review.client.prenom } : null,
      })),
      recommendedServices: recommendedServices.map((service) => ({
        id: service.idService,
        nomService: service.nomService,
        description: service.description,
        region: service.region,
        prix: service.prix,
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du tableau de bord prestataire",
      error: error.message,
    });
  }
};

exports.getClientDashboard = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || req.user.role !== "client" || String(req.user.id) !== String(id)) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const [appointments, appointmentCount, reviewCount, recommendedServices] = await Promise.all([
      RendezVous.findAll({
        where: { clientId: id },
        include: [
          {
            model: Service,
            as: "service",
            attributes: ["id", "nomService", "region", "prix"],
          },
          {
            model: Prestataire,
            as: "prestataire",
            attributes: ["id", "specialite"],
          },
        ],
        order: [["dateRdv", "DESC"], ["heureRdv", "DESC"]],
        limit: 4,
      }),
      RendezVous.count({ where: { clientId: id } }),
      Avis.count({ where: { clientId: id } }),
      Service.findAll({
        order: [["createdAt", "DESC"]],
        limit: 3,
      }),
    ]);

    const pendingCount = appointments.filter((appointment) => appointment.statut === "en_attente").length;

    res.status(200).json({
      appointmentCount,
      pendingAppointments: pendingCount,
      reviewCount,
      favoriteCount: recommendedServices.length,
      recentAppointments: appointments.map((appointment) => ({
        id: appointment.idRendezVous,
        dateRdv: appointment.dateRdv,
        heureRdv: appointment.heureRdv,
        adresseIntervention: appointment.adresseIntervention,
        statut: appointment.statut,
        service: appointment.service ? { nomService: appointment.service.nomService } : null,
        providerSpecialite: appointment.prestataire?.specialite ?? "",
      })),
      recommendedServices: recommendedServices.map((service) => ({
        id: service.id,
        nomService: service.nomService,
        description: service.description,
        region: service.region,
        prix: service.prix,
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du tableau de bord client",
      error: error.message,
    });
  }
};
