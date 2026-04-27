const sequelize = require("../config/bd");

const Admin = require("./admin");
const Client = require("./client");
const Prestataire = require("./prestataire");
const Document = require("./document");
const Service = require("./service");
const Categorie = require("./categorie");
const SousCategorie = require("./sous_categorie");
const RendezVous = require("./rendez-vous");
const Avis = require("./avis");
const Note = require("./note");
const Commentaire = require("./commentaire");

const db = {};

db.sequelize = sequelize;
db.Sequelize = require("sequelize");

// Export des modèles
db.Admin = Admin;
db.Client = Client;
db.Prestataire = Prestataire;
db.Document = Document;
db.Service = Service;
db.Categorie = Categorie;
db.SousCategorie = SousCategorie;
db.RendezVous = RendezVous;
db.Avis = Avis;
db.Note = Note;
db.Commentaire = Commentaire;

// Relations Client - Prestataire
Client.hasOne(Prestataire, { foreignKey: "clientId", as: "prestataire" });
Prestataire.belongsTo(Client, { foreignKey: "clientId", as: "client" });

// Relations Prestataire - Document
Prestataire.hasMany(Document, { foreignKey: "prestataireId", as: "documents" });
Document.belongsTo(Prestataire, { foreignKey: "prestataireId", as: "prestataire" });

// Relations Prestataire - Service
Prestataire.hasMany(Service, { foreignKey: "prestataireId", as: "services" });
Service.belongsTo(Prestataire, { foreignKey: "prestataireId", as: "prestataire" });

// Relations Categorie - SousCategorie
Categorie.hasMany(SousCategorie, { foreignKey: "categorieId", as: "sousCategories" });
SousCategorie.belongsTo(Categorie, { foreignKey: "categorieId", as: "categorie" });

// Relations SousCategorie - Service
SousCategorie.hasMany(Service, { foreignKey: "sousCategorieId", as: "services" });
Service.belongsTo(SousCategorie, { foreignKey: "sousCategorieId", as: "sousCategorie" });

// Relations Client - RendezVous
Client.hasMany(RendezVous, { foreignKey: "clientId", as: "rendezvous" });
RendezVous.belongsTo(Client, { foreignKey: "clientId", as: "client" });

// Relations Prestataire - RendezVous
Prestataire.hasMany(RendezVous, { foreignKey: "prestataireId", as: "rendezvous" });
RendezVous.belongsTo(Prestataire, { foreignKey: "prestataireId", as: "prestataire" });

// Relations Service - RendezVous
Service.hasMany(RendezVous, { foreignKey: "serviceId", as: "rendezvous" });
RendezVous.belongsTo(Service, { foreignKey: "serviceId", as: "service" });

// Relations Client - Avis
Client.hasMany(Avis, { foreignKey: "clientId", as: "avis" });
Avis.belongsTo(Client, { foreignKey: "clientId", as: "client" });

// Relations RendezVous - Avis
RendezVous.hasOne(Avis, { foreignKey: "rendezVousId", as: "avis" });
Avis.belongsTo(RendezVous, { foreignKey: "rendezVousId", as: "rendezVous" });

// Relations Avis - Note
Avis.hasOne(Note, { foreignKey: "avisId", as: "note" });
Note.belongsTo(Avis, { foreignKey: "avisId", as: "avis" });

// Relations Avis - Commentaire
Avis.hasOne(Commentaire, { foreignKey: "avisId", as: "commentaire" });
Commentaire.belongsTo(Avis, { foreignKey: "avisId", as: "avis" });

module.exports = db;