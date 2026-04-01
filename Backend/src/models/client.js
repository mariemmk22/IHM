const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Client = sequelize.define("Client", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  motDePasse: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  statutCompte: {
    type: DataTypes.ENUM("actif", "bloque", "inactif"),
    defaultValue: "actif",
  },
}, {
  tableName: "clients",
  timestamps: true,
});

module.exports = Client;