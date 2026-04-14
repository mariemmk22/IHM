const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");

const Avis = sequelize.define("Avis", {
  idAvis: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nbstart: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "avis",
  timestamps: true,
});

module.exports = Avis;