const express = require("express");
const app = express();
// Import routes
const prestataireRoutes = require("./routes/prestataireRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const documentRoutes = require("./routes/documentRoutes");
const clientRoutes = require("./routes/clientRoutes");
const authRoutes = require("./routes/authRoutes");
// Import sequelize
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

// Brancher les routes
app.use("/api/prestataires", prestataireRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/auth", authRoutes);


module.exports = app;