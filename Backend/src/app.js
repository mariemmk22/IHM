const express = require("express");
const app = express();

// Import sequelize
const { sequelize } = require("./models");

// Import routes
const prestataireRoutes = require("./routes/prestataireRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const documentRoutes = require("./routes/documentRoutes");
const clientRoutes = require("./routes/clientRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(express.json());

// Route test
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