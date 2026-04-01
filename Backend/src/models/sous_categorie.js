const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SousCategorie = sequelize.define("SousCategorie", {
  idSousCategorie: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nomSousCategorie: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: "sous_categories",
  timestamps: true,
});

module.exports = SousCategorie;