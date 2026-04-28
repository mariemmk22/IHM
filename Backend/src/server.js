const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: true })
  .then(() => {
    console.log("✅ Tables recréées avec succès");
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Erreur Sequelize :", error);
  });