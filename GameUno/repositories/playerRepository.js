const UnoPlayer = require('../models/playerModels');
const PlayerRepository = {
  create: async (playerData) => {
    return await UnoPlayer.create(playerData);
  },

  findById: async (playerId) => {
    return await UnoPlayer.findByPk(playerId);
  },

  findByEmail: async (playerEmail) => {
    return await UnoPlayer.findOne({where: {email: playerEmail}});
  },

  findByPassword: async (playerPassword) => {
    return await UnoPlayer.findOne({where: {userpassword: playerPassword}});
  },
  
  findAll: async () => {
    return await UnoPlayer.findAll();
  },

  findAllByGameId: async (gameId) => {
    return await UnoPlayer.findAll({ where: { gameid: gameId }, attributes: ['nameplayer'] });
  },
  
  findPlayersIdByNameplayer: async (namePlayer) => {
    return await UnoPlayer.findAll({ where: { nameplayer: namePlayer }, attributes: ['id'] });
  },

  update: async (playerId, playerData) => {
    let player = await UnoPlayer.findByPk(playerId);
    if (!player) {
      throw new Error('player not found');
    }
    return await player.update(playerData);
  },

  delete: async (playerId) => {
    let player = await UnoPlayer.findByPk(playerId);
    if (!player) {
      throw new Error('player not found');
    }
    await player.destroy();
  }
};

module.exports = PlayerRepository;
