const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");

const Note = sequelize.define("Note", {
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
  nbstart: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "notes",
  timestamps: true,
});

module.exports = Note;