const Score = require('../models/scoreModels');

const ScoreRepository = {
  create: async (scoreData) => {
    return await Score.create(scoreData);
  },

  findById: async (scoreId) => {
    return await Score.findByPk(scoreId);
  },

  findAll: async () => {
    return await Score.findAll();
  },

  findAllByGameId: async (gameId) => {
    return await Score.findAll({where: { gameId: gameId } });
  },

  update: async (scoreId, scoreData) => {
    let score = await Score.findByPk(scoreId);
    if (!score) {
      throw new Error('Score not found');
    }
    return await score.update(scoreData);
  },

  delete: async (scoreId) => {
    let score = await Score.findByPk(scoreId);
    if (!score) {
      throw new Error('Score not found');
    }
    await score.destroy();
  },
};

module.exports = ScoreRepository;
