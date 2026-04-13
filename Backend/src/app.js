const express = require("express");
const app = express();
const { sequelize } = require("./models");
const adminRoutes = require("./routes/adminRoutes");
const categorieRoutes = require("./routes/categorieRoutes");
const sousCategorieRoutes = require("./routes/sousCategorieRoutes");


app.use(express.json());
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categorieRoutes);
app.use("/api/sous-categories", sousCategorieRoutes);
app.get("/", (req, res) => {
  res.send("API OK");
});


module.exports = app;