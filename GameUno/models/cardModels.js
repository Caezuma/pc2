const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Card extends Model {}

Card.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    color: {
      type: DataTypes.STRING,
    },
    valuecard: {
      type: DataTypes.STRING,
    },
    gameId: {
      type: DataTypes.INTEGER,
    },
    player_id: {
      type: DataTypes.INTEGER,
    }
  },
  {
    sequelize,
    modelName: 'card',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Card;
