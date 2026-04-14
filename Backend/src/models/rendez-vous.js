const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");

const RendezVous = sequelize.define("RendezVous", {
  idRendezVous: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  dateRdv: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  heureRdv: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  adresseIntervention: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  statut: {
    type: DataTypes.ENUM("en_attente", "accepte", "annule"),
    defaultValue: "en_attente",
  },
}, {
  tableName: "rendez_vous",
  timestamps: true,
});

module.exports = RendezVous;