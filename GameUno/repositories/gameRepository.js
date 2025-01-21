const UnoGame = require('../models/gameModels');

const UnoRepository = {
  create: async (gameData) => {
    return await UnoGame.create(gameData);
  },

  findById: async (gameId) => {
    return await UnoGame.findByPk(gameId);
  },

  findAll: async () => {
    return await UnoGame.findAll();
  },

  update: async (gameId, gameData) => {
    let game = await UnoGame.findByPk(gameId);
    if (!game) {
      throw new Error('Jogo não encontrado');
    }
    return await game.update(gameData);
  },

  delete: async (gameId) => {
    let game = await UnoGame.findByPk(gameId);
    if (!game) {
      throw new Error('Jogo não encontrado');
    }
    await game.destroy();
  }
};

module.exports = UnoRepository;
