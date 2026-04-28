const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");

const Service = sequelize.define("Service", {
  idService: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nomService: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  prix: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  prestataireId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sousCategorieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "services",
  timestamps: true,
});

module.exports = Service;