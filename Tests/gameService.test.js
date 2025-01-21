const UnoServices = require('../GameUno/services/gameServices'); 
const UnoRepository = require('../GameUno/repositories/gameRepository');

jest.mock('../GameUno/repositories/gameRepository');

describe('UnoServices', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createGame', () => {
    it('should create a game and return the created game data', async () => {
      const gameData = { id: 1, status: 'in_progress' };
      UnoRepository.create.mockResolvedValue(gameData);

      const result = await UnoServices.createGame(gameData);

      expect(UnoRepository.create).toHaveBeenCalledWith(gameData);
      expect(result).toEqual(gameData);
    });
  });

  describe('statusGame', () => {
    it('should return "in_progress" when status is true', async () => {
      const result = await UnoServices.statusGame(true);
      expect(result).toBe('in_progress');
    });

    it('should return "stopped" when status is false', async () => {
      const result = await UnoServices.statusGame(false);
      expect(result).toBe('stopped');
    });
  });

  describe('getGameById', () => {
    it('should return the game data by ID', async () => {
      const gameId = 1;
      const gameData = { id: gameId, status: 'in_progress' };
      UnoRepository.findById.mockResolvedValue(gameData);

      const result = await UnoServices.getGameById(gameId);

      expect(UnoRepository.findById).toHaveBeenCalledWith(gameId);
      expect(result).toEqual(gameData);
    });
  });

  describe('getGameStatusById', () => {
    it('should return the game status by ID', async () => {
      const gameId = 1;
      const gameData = { id: gameId, statusgame: 'in_progress' };
      UnoRepository.findById.mockResolvedValue(gameData);

      const result = await UnoServices.getGameStatusById(gameId);

      expect(UnoRepository.findById).toHaveBeenCalledWith(gameId);
      expect(result).toBe(gameData.statusgame);
    });
  });

  describe('getAllGames', () => {
    it('should return all games', async () => {
      const games = [{ id: 1, status: 'in_progress' }, { id: 2, status: 'stopped' }];
      UnoRepository.findAll.mockResolvedValue(games);

      const result = await UnoServices.getAllGames();

      expect(UnoRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(games);
    });
  });

  describe('updateStatusGame', () => {
    it('should update the game status', async () => {
      const gameId = 1;
      const updates = { status: 'stopped' };
      UnoRepository.update.mockResolvedValue({ ...updates, id: gameId });

      const result = await UnoServices.updateStatusGame(gameId, updates);

      expect(UnoRepository.update).toHaveBeenCalledWith(gameId, updates);
      expect(result).toEqual({ ...updates, id: gameId });
    });
  });

  describe('checkGameExists', () => {
    it('should throw an error if the game does not exist', async () => {
      const gameId = 1;
      UnoRepository.findById.mockResolvedValue(null);

      await expect(UnoServices.checkGameExists(gameId)).rejects.toThrow('Game not found');
    });

    it('should not throw an error if the game exists', async () => {
      const gameId = 1;
      const gameData = { id: gameId, status: 'in_progress' };
      UnoRepository.findById.mockResolvedValue(gameData);

      await expect(UnoServices.checkGameExists(gameId)).resolves.not.toThrow();
    });
  });

  describe('getTopCard', () => {
    it('should return the top card of the game by ID', async () => {
      const gameId = 1;
      const gameData = { id: gameId, topcard: 'card1' };
      UnoRepository.findById.mockResolvedValue(gameData);

      const result = await UnoServices.getTopCard(gameId);

      expect(UnoRepository.findById).toHaveBeenCalledWith(gameId);
      expect(result).toBe(gameData.topcard);
    });
  });

  describe('updateGame', () => {
    it('should update the game data', async () => {
      const gameId = 1;
      const gameData = { id: gameId, status: 'in_progress' };
      UnoRepository.update.mockResolvedValue(gameData);

      const result = await UnoServices.updateGame(gameId, gameData);

      expect(UnoRepository.update).toHaveBeenCalledWith(gameId, gameData);
      expect(result).toEqual(gameData);
    });
  });

  describe('deleteGame', () => {
    it('should delete the game by ID', async () => {
      const gameId = 1;
      UnoRepository.delete.mockResolvedValue({ id: gameId });

      const result = await UnoServices.deleteGame(gameId);

      expect(UnoRepository.delete).toHaveBeenCalledWith(gameId);
      expect(result).toEqual({ id: gameId });
    });
  });

  describe('updateGamePartial', () => {
    it('should partially update the game data', async () => {
      const gameId = 1;
      const updates = { status: 'stopped' };
      UnoRepository.update.mockResolvedValue({ ...updates, id: gameId });

      const result = await UnoServices.updateGamePartial(gameId, updates);

      expect(UnoRepository.update).toHaveBeenCalledWith(gameId, updates);
      expect(result).toEqual({ ...updates, id: gameId });
    });
  });
});
