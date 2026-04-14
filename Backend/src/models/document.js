const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");

const Document = sequelize.define("Document", {
  idDocument: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fichier: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateDepot: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  statut: {
    type: DataTypes.ENUM("en_attente", "accepte", "refuse"),
    defaultValue: "en_attente",
  },
}, {
  tableName: "documents",
  timestamps: true,
});

module.exports = Document;