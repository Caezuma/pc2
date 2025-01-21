const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');


class UnoGame extends Model {}

UnoGame.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    statusgame: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    topcard: {
      type: DataTypes.STRING,
    },
    rules: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    maxPlayers: {
      type: DataTypes.INTEGER
    },
    gameowner: {
      type: DataTypes.STRING,
    },
    gameturn: {
      type: DataTypes.STRING,
    }
  },
  {
    sequelize,
    modelName: 'uno_game',
    timestamps: true, 
    underscored: true 
  }
);

module.exports = UnoGame;
