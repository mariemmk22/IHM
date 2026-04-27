const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");

const Commentaire = sequelize.define("Commentaire", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  avisId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "avis",
      key: "idAvis",
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: "commentaires",
  timestamps: true,
});

module.exports = Commentaire;