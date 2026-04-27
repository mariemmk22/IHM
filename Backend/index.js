require("dotenv").config();

const app = require("./src/app");
const { sequelize } = require("./src/models");

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log("Connexion MySQL réussie");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("Tables synchronisées");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erreur base de données :", error);
  });