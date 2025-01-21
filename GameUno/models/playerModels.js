const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Player extends Model {}

Player.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nameplayer: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    age: {
      type: DataTypes.INTEGER
    },
    email: {
      type: DataTypes.STRING,
    },
    userpassword: {
      type: DataTypes.STRING,
    }, 
    gameid: {
      type: DataTypes.INTEGER
    },

  },
  {
    sequelize,
    modelName: 'player',
    timestamps: true,
    underscored: true
  }
);

module.exports = Player;
