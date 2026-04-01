const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Commentaire = sequelize.define("Commentaire", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: "commentaires",
  timestamps: true,
});

module.exports = Commentaire;