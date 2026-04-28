const bcrypt = require("bcryptjs");
const sequelize = require("./src/config/bd");
const Admin = require("./src/models/admin");
const Client = require("./src/models/client");
const Prestataire = require("./src/models/prestatair");
const Categorie = require("./src/models/categorie");
const SousCategorie = require("./src/models/sous_categorie");
const Service = require("./src/models/service");

// Setup associations needed for sync
Client.hasOne(Prestataire, { foreignKey: "clientId" });
Prestataire.belongsTo(Client, { foreignKey: "clientId" });
Categorie.hasMany(SousCategorie, { foreignKey: "categorieId", sourceKey: "idCategorie" });
SousCategorie.belongsTo(Categorie, { foreignKey: "categorieId", targetKey: "idCategorie" });
SousCategorie.hasMany(Service, { foreignKey: "sousCategorieId", sourceKey: "idSousCategorie" });
Service.belongsTo(SousCategorie, { foreignKey: "sousCategorieId", targetKey: "idSousCategorie" });
Prestataire.hasMany(Service, { foreignKey: "prestataireId" });
Service.belongsTo(Prestataire, { foreignKey: "prestataireId" });

async function seed() {
  await sequelize.authenticate();
  console.log("✅ Connecté à la base");

  // 1. Admin
  const adminPass = await bcrypt.hash("admin123", 10);
  await Admin.findOrCreate({
    where: { email: "admin@admin.com" },
    defaults: { nom: "Admin", motDePasse: adminPass },
  });
  console.log("✅ Admin créé — admin@admin.com / admin123");

  // 2. Catégories
  const [maison] = await Categorie.findOrCreate({ where: { nomCategorie: "Maison" }, defaults: { description: "Services à domicile" } });
  const [tech] = await Categorie.findOrCreate({ where: { nomCategorie: "Technologie" }, defaults: { description: "Services informatiques" } });
  const [sante] = await Categorie.findOrCreate({ where: { nomCategorie: "Santé & Bien-être" }, defaults: { description: "Services de santé" } });
  console.log("✅ Catégories créées");

  // 3. Sous-catégories
  const [plomberie] = await SousCategorie.findOrCreate({ where: { nomSousCategorie: "Plomberie" }, defaults: { categorieId: maison.idCategorie } });
  const [electricite] = await SousCategorie.findOrCreate({ where: { nomSousCategorie: "Électricité" }, defaults: { categorieId: maison.idCategorie } });
  const [menage] = await SousCategorie.findOrCreate({ where: { nomSousCategorie: "Ménage" }, defaults: { categorieId: maison.idCategorie } });
  const [jardinage] = await SousCategorie.findOrCreate({ where: { nomSousCategorie: "Jardinage" }, defaults: { categorieId: maison.idCategorie } });
  const [informatique] = await SousCategorie.findOrCreate({ where: { nomSousCategorie: "Informatique" }, defaults: { categorieId: tech.idCategorie } });
  const [massage] = await SousCategorie.findOrCreate({ where: { nomSousCategorie: "Massage" }, defaults: { categorieId: sante.idCategorie } });
  console.log("✅ Sous-catégories créées");

  // 4. Clients (qui deviendront prestataires)
  const pass = await bcrypt.hash("password123", 10);

  const [c1] = await Client.findOrCreate({ where: { email: "sami.trabelsi@gmail.com" }, defaults: { nom: "Trabelsi", prenom: "Sami", motDePasse: pass, telephone: "22334455", region: "Tunis", adresse: "Rue de la Liberté, Tunis" } });
  const [c2] = await Client.findOrCreate({ where: { email: "leila.ben@gmail.com" }, defaults: { nom: "Ben Ali", prenom: "Leila", motDePasse: pass, telephone: "55667788", region: "Sfax", adresse: "Avenue Habib Bourguiba, Sfax" } });
  const [c3] = await Client.findOrCreate({ where: { email: "karim.mansour@gmail.com" }, defaults: { nom: "Mansour", prenom: "Karim", motDePasse: pass, telephone: "99887766", region: "Sousse", adresse: "Rue Ibn Khaldoun, Sousse" } });
  const [c4] = await Client.findOrCreate({ where: { email: "fatma.gharbi@gmail.com" }, defaults: { nom: "Gharbi", prenom: "Fatma", motDePasse: pass, telephone: "44556677", region: "Tunis", adresse: "Cité El Khadra, Tunis" } });

  // 5. Client normal
  await Client.findOrCreate({ where: { email: "client@test.com" }, defaults: { nom: "Dupont", prenom: "Jean", motDePasse: pass, telephone: "11223344", region: "Tunis", adresse: "Lac 1, Tunis" } });
  console.log("✅ Clients créés — password: password123");

  // 6. Prestataires
  const [p1] = await Prestataire.findOrCreate({ where: { clientId: c1.id }, defaults: { specialite: "Électricien", description: "Électricien certifié avec 10 ans d'expérience", disponibilite: true } });
  const [p2] = await Prestataire.findOrCreate({ where: { clientId: c2.id }, defaults: { specialite: "Plombier", description: "Plombière professionnelle, intervention rapide", disponibilite: true } });
  const [p3] = await Prestataire.findOrCreate({ where: { clientId: c3.id }, defaults: { specialite: "Informaticien", description: "Expert en dépannage informatique et réseaux", disponibilite: false } });
  const [p4] = await Prestataire.findOrCreate({ where: { clientId: c4.id }, defaults: { specialite: "Agent de ménage", description: "Service de ménage professionnel", disponibilite: true } });
  console.log("✅ Prestataires créés");

  // 7. Services
  await Service.findOrCreate({ where: { nomService: "Installation électrique complète" }, defaults: { description: "Installation et mise aux normes de votre installation électrique", region: "Tunis", prix: 150, prestataireId: p1.id, sousCategorieId: electricite.idSousCategorie } });
  await Service.findOrCreate({ where: { nomService: "Dépannage électrique urgent" }, defaults: { description: "Intervention rapide pour pannes électriques", region: "Tunis", prix: 80, prestataireId: p1.id, sousCategorieId: electricite.idSousCategorie } });
  await Service.findOrCreate({ where: { nomService: "Réparation fuite d'eau" }, defaults: { description: "Détection et réparation de fuites d'eau", region: "Sfax", prix: 120, prestataireId: p2.id, sousCategorieId: plomberie.idSousCategorie } });
  await Service.findOrCreate({ where: { nomService: "Installation sanitaire" }, defaults: { description: "Installation de douche, baignoire, lavabo", region: "Sfax", prix: 200, prestataireId: p2.id, sousCategorieId: plomberie.idSousCategorie } });
  await Service.findOrCreate({ where: { nomService: "Dépannage PC et laptop" }, defaults: { description: "Réparation et maintenance de vos ordinateurs", region: "Sousse", prix: 60, prestataireId: p3.id, sousCategorieId: informatique.idSousCategorie } });
  await Service.findOrCreate({ where: { nomService: "Installation réseau WiFi" }, defaults: { description: "Configuration et optimisation de votre réseau", region: "Sousse", prix: 90, prestataireId: p3.id, sousCategorieId: informatique.idSousCategorie } });
  await Service.findOrCreate({ where: { nomService: "Ménage complet appartement" }, defaults: { description: "Nettoyage complet de votre appartement", region: "Tunis", prix: 70, prestataireId: p4.id, sousCategorieId: menage.idSousCategorie } });
  await Service.findOrCreate({ where: { nomService: "Entretien jardin" }, defaults: { description: "Tonte, taille et entretien de votre jardin", region: "Tunis", prix: 50, prestataireId: p4.id, sousCategorieId: jardinage.idSousCategorie } });
  console.log("✅ Services créés");

  console.log("\n🎉 Base de données remplie avec succès !");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("👤 Admin     : admin@admin.com / admin123");
  console.log("👤 Client    : client@test.com / password123");
  console.log("👤 Prestataire: sami.trabelsi@gmail.com / password123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  await sequelize.close();
}

seed().catch((e) => {
  console.error("❌ Erreur seed:", e.message);
  process.exit(1);
});
