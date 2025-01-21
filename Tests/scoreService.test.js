const ScoreService = require('../GameUno/services/scoreServices');
const ScoreRepository = require('../GameUno/repositories/scoreRepository');
const PlayerService = require('../GameUno/services/playerServices');

jest.mock('../GameUno/repositories/scoreRepository');
jest.mock('../GameUno/services/playerServices');

describe('ScoreService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createGame', () => {
    it('should create a new score', async () => {
      const scoreData = { score: 313 };
      ScoreRepository.create.mockResolvedValue(scoreData);

      const result = await ScoreService.createScore(scoreData);

      expect(ScoreRepository.create).toHaveBeenCalledWith(scoreData);
      expect(result).toEqual(scoreData);
    });
  });

  describe('getScoreById', () => {
    it('should get a score by ID', async () => {
      const scoreId = 1;
      const scoreData = { id: scoreId, score: 313 };
      ScoreRepository.findById.mockResolvedValue(scoreData);

      const result = await ScoreService.getScoreById(scoreId);

      expect(ScoreRepository.findById).toHaveBeenCalledWith(scoreId);
      expect(result).toEqual(scoreData);
    });
  });

  describe('updateScore', () => {
    it('should update a score', async () => {
      const scoreId = 1;
      const scoreData = { score: 400 };
      ScoreRepository.update.mockResolvedValue(scoreData);

      const result = await ScoreService.updateScore(scoreId, scoreData);

      expect(ScoreRepository.update).toHaveBeenCalledWith(scoreId, scoreData);
      expect(result).toEqual(scoreData);
    });
  });

  describe('deleteScore', () => {
    it('should delete a score by ID', async () => {
      const scoreId = 1;
      ScoreRepository.delete.mockResolvedValue({ success: true });

      const result = await ScoreService.deleteScore(scoreId);

      expect(ScoreRepository.delete).toHaveBeenCalledWith(scoreId);
      expect(result).toEqual({ success: true });
    });
  });

  describe('updateScorePartial', () => {
    it('should partially update a score', async () => {
      const scoreId = 1;
      const updates = { score: 350 };
      ScoreRepository.update.mockResolvedValue(updates);

      const result = await ScoreService.updateScorePartial(scoreId, updates);

      expect(ScoreRepository.update).toHaveBeenCalledWith(scoreId, updates);
      expect(result).toEqual(updates);
    });
  });

  describe('getAllScores', () => {
    it('should get all scores', async () => {
      const scores = [
        { id: 1, score: 100 },
        { id: 2, score: 200 }
      ];
      ScoreRepository.findAll.mockResolvedValue(scores);

      const result = await ScoreService.getAllScores();

      expect(ScoreRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(scores);
    });

    it('should handle errors when fetching all scores', async () => {
      const error = new Error('Fetch failed');
      ScoreRepository.findAll.mockRejectedValue(error);

      await expect(ScoreService.getAllScores()).rejects.toThrow('Fetch failed');

      expect(ScoreRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('updateScorePartial', () => {
    it('should partially update a score', async () => {
      const scoreId = 1;
      const updates = { score: 350 };
      ScoreRepository.update.mockResolvedValue(updates);

      const result = await ScoreService.updateScorePartial(scoreId, updates);

      expect(ScoreRepository.update).toHaveBeenCalledWith(scoreId, updates);
      expect(result).toEqual(updates);
    });

    it('should handle errors when partially updating a score', async () => {
      const scoreId = 1;
      const updates = { score: 350 };
      const error = new Error('Update failed');
      ScoreRepository.update.mockRejectedValue(error);

      await expect(ScoreService.updateScorePartial(scoreId, updates)).rejects.toThrow('Update failed');

      expect(ScoreRepository.update).toHaveBeenCalledWith(scoreId, updates);
    });
  });


  describe('getScoresAndPlayersIdByGameId', () => {
    it('should return an empty map when there are no scores', async () => {
      const gameId = 1;
      const players = [
        { id: 1, nameplayer: 'Player1' },
        { id: 2, nameplayer: 'Player2' }
      ];
      const scores = []; 
      PlayerService.getAllPlayers.mockResolvedValue(players);
      ScoreRepository.findAllByGameId.mockResolvedValue(scores);

      const result = await ScoreService.getScoresAndPlayersIdByGameId(gameId);

      expect(PlayerService.getAllPlayers).toHaveBeenCalled();
      expect(ScoreRepository.findAllByGameId).toHaveBeenCalledWith(gameId);
      expect(result).toEqual({
        'Player1': undefined,
        'Player2': undefined
      });
    });

    it('should return a map of player names to scores when data is available', async () => {
      const gameId = 1;
      const players = [
        { id: 1, nameplayer: 'Player1' },
        { id: 2, nameplayer: 'Player2' }
      ];
      const scores = [
        { playerId: 1, score: 100 },
        { playerId: 2, score: 200 }
      ];
      PlayerService.getAllPlayers.mockResolvedValue(players);
      ScoreRepository.findAllByGameId.mockResolvedValue(scores);

      const result = await ScoreService.getScoresAndPlayersIdByGameId(gameId);

      expect(PlayerService.getAllPlayers).toHaveBeenCalled();
      expect(ScoreRepository.findAllByGameId).toHaveBeenCalledWith(gameId);
      expect(result).toEqual({
        'Player1': 100,
        'Player2': 200
      });
    });

    it('should handle errors from PlayerService', async () => {
      const gameId = 1;
      const error = new Error('PlayerService error');
      PlayerService.getAllPlayers.mockRejectedValue(error);
      ScoreRepository.findAllByGameId.mockResolvedValue([]);

      await expect(ScoreService.getScoresAndPlayersIdByGameId(gameId)).rejects.toThrow('PlayerService error');

      expect(PlayerService.getAllPlayers).toHaveBeenCalled();
      expect(ScoreRepository.findAllByGameId).not.toHaveBeenCalled();
    });

    it('should handle errors from ScoreRepository', async () => {
      const gameId = 1;
      const players = [
        { id: 1, nameplayer: 'Player1' },
        { id: 2, nameplayer: 'Player2' }
      ];
      const error = new Error('ScoreRepository error');
      PlayerService.getAllPlayers.mockResolvedValue(players);
      ScoreRepository.findAllByGameId.mockRejectedValue(error);

      await expect(ScoreService.getScoresAndPlayersIdByGameId(gameId)).rejects.toThrow('ScoreRepository error');

      expect(PlayerService.getAllPlayers).toHaveBeenCalled();
      expect(ScoreRepository.findAllByGameId).toHaveBeenCalledWith(gameId);
    });

   
  });

  
});
