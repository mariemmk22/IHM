const express = require("express");
const app = express();
const { sequelize } = require("./models");

app.use(express.json());

sequelize.sync({ alter: true })
  .then(() => {
    console.log("Base de données synchronisée");
  })
  .catch((err) => {
    console.error("Erreur DB:", err);
  });

app.get("/", (req, res) => {
  res.send("API OK");
});

module.exports = app;