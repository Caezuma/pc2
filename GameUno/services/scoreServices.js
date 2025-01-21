const ScoreRepository = require('../repositories/scoreRepository');
const PlayerService = require('./playerServices');

const scorePlayersId = {};
const playerIdPlayer = {};
const playerScore = {};

const ScoreService = {
  createScore: async (scoreData) => {
    return await ScoreRepository.create(scoreData);
  },

  getScoreById: async (scoreId) => {
    return await ScoreRepository.findById(scoreId);
  },

  getScoresAndPlayersIdByGameId: async (gameId) => {
    const players = await PlayerService.getAllPlayers();
    players.forEach(player => {
      playerIdPlayer[player.id] = player.nameplayer;
    });

    const scores = await ScoreRepository.findAllByGameId(gameId);
    scores.forEach(score => {
      scorePlayersId[score.playerId] = score.score;
    });

    for (const [id, valor] of Object.entries(scorePlayersId)) {
      const nome = playerIdPlayer[id];
      if (nome) {
        playerScore[nome] = valor;
      }
    }

    return playerScore;
  },

  getAllScores: async () => {
    return await ScoreRepository.findAll();
  },

  updateScore: async (scoreId, scoreData) => {
    return await ScoreRepository.update(scoreId, scoreData);
  },

  deleteScore: async (scoreId) => {
    return await ScoreRepository.delete(scoreId);
  },

  updateScorePartial: async (scoreId, updates) => {
    return await ScoreRepository.update(scoreId, updates);
  }
};

module.exports = ScoreService;
