const UnoRepository = require('../repositories/gameRepository');

const UnoServices = {
  createGame: async (gameData) => {
    return await UnoRepository.create(gameData);
  },

  statusGame: async (status) => {
    if(status){
      return "in_progress"
    }else{
      return "stopped"
    }
  },

  getGameById: async (gameId) => {
    return await UnoRepository.findById(gameId);
  },

  getGameStatusById: async (id) => {
    const game = await UnoRepository.findById(id);
    return game.statusgame;
  },

  getAllGames: async () => {
    return await UnoRepository.findAll();
  },

  updateStatusGame: async (gameId, updates) => {
    return await UnoRepository.update(gameId, updates);
  },

  checkGameExists: async (gameId) => {
    const game = await UnoRepository.findById(gameId);
      if (!game && gameId != null) {
        throw new Error('Game not found');
      }
  },

  getTopCard: async (gameId) => {
    gameId = await UnoRepository.findById(gameId);
    return gameId.topcard;
  },

  updateGame: async (gameId, gameData) => {
    return await UnoRepository.update(gameId, gameData);
  },

  deleteGame: async (gameId) => {
    return await UnoRepository.delete(gameId);
  },

  updateGamePartial: async (gameId, updates) => {
    return await UnoRepository.update(gameId, updates);
  }
};

module.exports = UnoServices;
