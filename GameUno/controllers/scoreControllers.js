const ScoreService = require('../services/scoreServices');

const ScoreController = {
  createScore: async (req, res, next) => {
    try {
      const score = await ScoreService.createScore(req.body);
      res.status(201).json(score);
    } catch (err) {
      next(err);
    }
  },

  getScoreById: async (req, res, next) => {
    try {
      const score = await ScoreService.getScoreById(req.params.id);
      res.status(200).json(score);
    } catch (err) {
      if (err.message === 'Score not found') {
        res.status(401).json({ error: 'Score not found'});
      } else {
        next(err);
      }
    }
  },

  getAllScores: async (req, res, next) => {
    try {
      const scores = await ScoreService.getAllScores();
      res.status(200).json(scores);
    } catch (err) {
      next(err);
    }
  },


  getAllScoresInGame: async (req, res, next) => {
    try {
      const scores = await ScoreService.getScoresAndPlayersIdByGameId(req.params.id);
      res.status(200).json({game_id: req.params.id, scores_game: scores});
    } catch (err) {
      next(err);
    }
  },

  updateScore: async (req, res, next) => {
    try {
      const score = await ScoreService.updateScore(req.params.id, req.body);
      res.status(200).json(score);
    } catch (err) {
      next(err);
    }
  },

  deleteScore: async (req, res, next) => {
    try {
      await ScoreService.deleteScore(req.params.id);
      res.status(204).end();
    } catch (err) {
      if (err.message === 'Score not found') {
        res.status(401).json({ error: 'Score not found'});
      } else {
        next(err);
      }
    }
  },

  updateScorePartial: async (req, res, next) => {
    try {
      const score = await ScoreService.updateScorePartial(req.params.id, req.body);
      res.status(200).json(score);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ScoreController;
