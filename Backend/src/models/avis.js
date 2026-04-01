const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Avis = sequelize.define("Avis", {
  idAvis: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  dateAvis: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "avis",
  timestamps: true,
});

module.exports = Avis;