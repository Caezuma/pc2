const ScoreRepository = require('../GameUno/repositories/scoreRepository');
const Score = require('../GameUno/models/scoreModels');

jest.mock('../GameUno/models/scoreModels');

describe('ScoreRepository', () => {
  let mockScoreInstance;

  beforeEach(() => {
    mockScoreInstance = {
      update: jest.fn(),
      destroy: jest.fn()
    };

    Score.create.mockResolvedValue(mockScoreInstance);
    Score.findByPk.mockResolvedValue(mockScoreInstance);
    Score.findAll.mockResolvedValue([mockScoreInstance]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new score', async () => {
      const scoreData = { playerId: 1, gameId: 1, score: 100 };
      Score.create.mockResolvedValue(scoreData);

      const result = await ScoreRepository.create(scoreData);

      expect(Score.create).toHaveBeenCalledWith(scoreData);
      expect(result).toEqual(scoreData);
    });

    it('should handle errors', async () => {
      const error = new Error('Creation error');
      Score.create.mockRejectedValue(error);

      await expect(ScoreRepository.create({})).rejects.toThrow('Creation error');
    });
  });

  describe('findById', () => {
    it('should find a score by id', async () => {
      const scoreId = 1;
      const scoreData = { id: scoreId, playerId: 1, gameId: 1, score: 100 };
      Score.findByPk.mockResolvedValue(scoreData);

      const result = await ScoreRepository.findById(scoreId);

      expect(Score.findByPk).toHaveBeenCalledWith(scoreId);
      expect(result).toEqual(scoreData);
    });

    it('should return null if score is not found', async () => {
      const scoreId = 1;
      Score.findByPk.mockResolvedValue(null);

      const result = await ScoreRepository.findById(scoreId);

      expect(Score.findByPk).toHaveBeenCalledWith(scoreId);
      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      const error = new Error('Find error');
      Score.findByPk.mockRejectedValue(error);

      await expect(ScoreRepository.findById(1)).rejects.toThrow('Find error');
    });
  });

  describe('findAll', () => {
    it('should return all scores', async () => {
      const scores = [{ id: 1, playerId: 1, gameId: 1, score: 100 }];
      Score.findAll.mockResolvedValue(scores);

      const result = await ScoreRepository.findAll();

      expect(Score.findAll).toHaveBeenCalled();
      expect(result).toEqual(scores);
    });

    it('should handle errors', async () => {
      const error = new Error('Find all error');
      Score.findAll.mockRejectedValue(error);

      await expect(ScoreRepository.findAll()).rejects.toThrow('Find all error');
    });
  });

  describe('findAllByGameId', () => {
    it('should return all scores for a specific game', async () => {
      const gameId = 1;
      const scores = [{ id: 1, playerId: 1, gameId: gameId, score: 100 }];
      Score.findAll.mockResolvedValue(scores);

      const result = await ScoreRepository.findAllByGameId(gameId);

      expect(Score.findAll).toHaveBeenCalledWith({ where: { gameId: gameId } });
      expect(result).toEqual(scores);
    });

    it('should handle errors', async () => {
      const error = new Error('Find by gameId error');
      Score.findAll.mockRejectedValue(error);

      await expect(ScoreRepository.findAllByGameId(1)).rejects.toThrow('Find by gameId error');
    });
  });

  describe('update', () => {
    it('should update an existing score', async () => {
      const scoreId = 1;
      const scoreData = { score: 150 };
      const updatedScore = { id: scoreId, playerId: 1, gameId: 1, score: 150 };
      Score.findByPk.mockResolvedValue({ ...mockScoreInstance, ...scoreData });
      mockScoreInstance.update.mockResolvedValue(updatedScore);

      const result = await ScoreRepository.update(scoreId, scoreData);

      expect(Score.findByPk).toHaveBeenCalledWith(scoreId);
      expect(mockScoreInstance.update).toHaveBeenCalledWith(scoreData);
      expect(result).toEqual(updatedScore);
    });

    it('should throw an error if score is not found', async () => {
      const scoreId = 1;
      const scoreData = { score: 150 };
      Score.findByPk.mockResolvedValue(null);

      await expect(ScoreRepository.update(scoreId, scoreData)).rejects.toThrow('Score not found');
    });

    it('should handle errors', async () => {
      const error = new Error('Update error');
      Score.findByPk.mockResolvedValue(mockScoreInstance);
      mockScoreInstance.update.mockRejectedValue(error);

      await expect(ScoreRepository.update(1, {})).rejects.toThrow('Update error');
    });
  });

  describe('delete', () => {
    it('should delete a score', async () => {
      const scoreId = 1;
      Score.findByPk.mockResolvedValue(mockScoreInstance);
      mockScoreInstance.destroy.mockResolvedValue();

      await ScoreRepository.delete(scoreId);

      expect(Score.findByPk).toHaveBeenCalledWith(scoreId);
      expect(mockScoreInstance.destroy).toHaveBeenCalled();
    });

    it('should throw an error if score is not found', async () => {
      const scoreId = 1;
      Score.findByPk.mockResolvedValue(null);

      await expect(ScoreRepository.delete(scoreId)).rejects.toThrow('Score not found');
    });

    it('should handle errors', async () => {
      const error = new Error('Delete error');
      Score.findByPk.mockResolvedValue(mockScoreInstance);
      mockScoreInstance.destroy.mockRejectedValue(error);

      await expect(ScoreRepository.delete(1)).rejects.toThrow('Delete error');
    });
  });
});
