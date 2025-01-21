const ScoreController = require('../GameUno/controllers/scoreControllers');
const ScoreService = require('../GameUno/services/scoreServices');

jest.mock('../GameUno/services/scoreServices');


describe('ScoreController', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { params: {}, body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createScore', () => {
    it('should create a new score', async () => {
      const scoreData = { playerId: 1, gameId: 1, score: 100 };
      mockReq.body = scoreData;
      ScoreService.createScore.mockResolvedValue(scoreData);

      await ScoreController.createScore(mockReq, mockRes, mockNext);

      expect(ScoreService.createScore).toHaveBeenCalledWith(scoreData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(scoreData);
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      ScoreService.createScore.mockRejectedValue(error);

      await ScoreController.createScore(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getScoreById', () => {
    it('should return score by id', async () => {
      const scoreData = { id: 1, playerId: 1, gameId: 1, score: 100 };
      mockReq.params.id = 1; 
      ScoreService.getScoreById.mockResolvedValue(scoreData);

      await ScoreController.getScoreById(mockReq, mockRes, mockNext);

      expect(ScoreService.getScoreById).toHaveBeenCalledWith(Number(mockReq.params.id)); // Convert to Number
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(scoreData);
    });
    it('should handle errors', async () => {
      const error = new Error('error');
      ScoreService.getScoreById.mockRejectedValue(error);

      await ScoreController.getScoreById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllScores', () => {
    it('should return all scores', async () => {
      const scores = [{ id: 1, playerId: 1, gameId: 1, score: 100 }];
      ScoreService.getAllScores.mockResolvedValue(scores);

      await ScoreController.getAllScores(mockReq, mockRes, mockNext);

      expect(ScoreService.getAllScores).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(scores);
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      ScoreService.getAllScores.mockRejectedValue(error);

      await ScoreController.getAllScores(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllScoresInGame', () => {
    it('should return all scores for a specific game', async () => {
      const scores = [{ id: 1, playerId: 1, score: 100 }];
      mockReq.params.id = 1; 
      ScoreService.getScoresAndPlayersIdByGameId.mockResolvedValue(scores);

      await ScoreController.getAllScoresInGame(mockReq, mockRes, mockNext);

      expect(ScoreService.getScoresAndPlayersIdByGameId).toHaveBeenCalledWith(Number(mockReq.params.id));
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ game_id: Number(mockReq.params.id), scores_game: scores });
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      ScoreService.getScoresAndPlayersIdByGameId.mockRejectedValue(error);

      await ScoreController.getAllScoresInGame(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateScore', () => {
    it('should update an existing score', async () => {
      const scoreData = { playerId: 1, gameId: 1, score: 150 };
      mockReq.params.id = 1; 
      mockReq.body = scoreData;
      ScoreService.updateScore.mockResolvedValue(scoreData);

      await ScoreController.updateScore(mockReq, mockRes, mockNext);

      expect(ScoreService.updateScore).toHaveBeenCalledWith(Number(mockReq.params.id), scoreData); 
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(scoreData);
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      ScoreService.updateScore.mockRejectedValue(error);

      await ScoreController.updateScore(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteScore', () => {
    it('should delete a score', async () => {
      mockReq.params.id = 1; 
      ScoreService.deleteScore.mockResolvedValue();

      await ScoreController.deleteScore(mockReq, mockRes, mockNext);

      expect(ScoreService.deleteScore).toHaveBeenCalledWith(Number(mockReq.params.id)); 
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.end).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      ScoreService.deleteScore.mockRejectedValue(error);

      await ScoreController.deleteScore(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateScorePartial', () => {
    it('should partially update an existing score', async () => {
      const scoreData = { score: 200 };
      mockReq.params.id = 1;
      mockReq.body = scoreData;
      ScoreService.updateScorePartial.mockResolvedValue(scoreData);

      await ScoreController.updateScorePartial(mockReq, mockRes, mockNext);

      expect(ScoreService.updateScorePartial).toHaveBeenCalledWith(Number(mockReq.params.id), scoreData); 
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(scoreData);
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      ScoreService.updateScorePartial.mockRejectedValue(error);

      await ScoreController.updateScorePartial(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
