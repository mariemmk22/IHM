// models/prestataire.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");

const Prestataire = sequelize.define("Prestataire", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  // 🔥 relation avec Client
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  specialite: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  disponibilite: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Prestataire;