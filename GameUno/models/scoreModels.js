const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Score extends Model {}

Score.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

  },
  {
    sequelize,
    modelName: 'score',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Score;
