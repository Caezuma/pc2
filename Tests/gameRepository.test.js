const UnoRepository = require('../GameUno/repositories/gameRepository');
const UnoGame = require('../GameUno/models/gameModels');

jest.mock('../GameUno/models/gameModels');

describe('UnoRepository', () => {
  let mockGameInstance;

  beforeEach(() => {
    mockGameInstance = {
      update: jest.fn(),
      destroy: jest.fn()
    };

    UnoGame.create.mockResolvedValue(mockGameInstance);
    UnoGame.findByPk.mockResolvedValue(mockGameInstance);
    UnoGame.findAll.mockResolvedValue([mockGameInstance]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new game', async () => {
      const gameData = { name: 'Uno Game' };
      UnoGame.create.mockResolvedValue(gameData);

      const result = await UnoRepository.create(gameData);

      expect(UnoGame.create).toHaveBeenCalledWith(gameData);
      expect(result).toEqual(gameData);
    });

    it('should handle errors', async () => {
      const error = new Error('Creation error');
      UnoGame.create.mockRejectedValue(error);

      await expect(UnoRepository.create({})).rejects.toThrow('Creation error');
    });
  });

  describe('findById', () => {
    it('should find a game by id', async () => {
      const gameId = 1;
      const gameData = { id: gameId, name: 'Uno Game' };
      UnoGame.findByPk.mockResolvedValue(gameData);

      const result = await UnoRepository.findById(gameId);

      expect(UnoGame.findByPk).toHaveBeenCalledWith(gameId);
      expect(result).toEqual(gameData);
    });

    it('should return null if game is not found', async () => {
      const gameId = 1;
      UnoGame.findByPk.mockResolvedValue(null);

      const result = await UnoRepository.findById(gameId);

      expect(UnoGame.findByPk).toHaveBeenCalledWith(gameId);
      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      const error = new Error('Find error');
      UnoGame.findByPk.mockRejectedValue(error);

      await expect(UnoRepository.findById(1)).rejects.toThrow('Find error');
    });
  });

  describe('findAll', () => {
    it('should return all games', async () => {
      const games = [{ id: 1, name: 'Uno Game' }];
      UnoGame.findAll.mockResolvedValue(games);

      const result = await UnoRepository.findAll();

      expect(UnoGame.findAll).toHaveBeenCalled();
      expect(result).toEqual(games);
    });

    it('should handle errors', async () => {
      const error = new Error('Find all error');
      UnoGame.findAll.mockRejectedValue(error);

      await expect(UnoRepository.findAll()).rejects.toThrow('Find all error');
    });
  });

  describe('update', () => {
    it('should update an existing game', async () => {
      const gameId = 1;
      const gameData = { name: 'Updated Uno Game' };
      const updatedGame = { id: gameId, name: 'Updated Uno Game' };
      UnoGame.findByPk.mockResolvedValue({ ...mockGameInstance, ...gameData });
      mockGameInstance.update.mockResolvedValue(updatedGame);

      const result = await UnoRepository.update(gameId, gameData);

      expect(UnoGame.findByPk).toHaveBeenCalledWith(gameId);
      expect(mockGameInstance.update).toHaveBeenCalledWith(gameData);
      expect(result).toEqual(updatedGame);
    });

    it('should throw an error if game is not found', async () => {
      const gameId = 1;
      const gameData = { name: 'Updated Uno Game' };
      UnoGame.findByPk.mockResolvedValue(null);

      await expect(UnoRepository.update(gameId, gameData)).rejects.toThrow('Jogo não encontrado');
    });

    it('should handle errors', async () => {
      const error = new Error('Update error');
      UnoGame.findByPk.mockResolvedValue(mockGameInstance);
      mockGameInstance.update.mockRejectedValue(error);

      await expect(UnoRepository.update(1, {})).rejects.toThrow('Update error');
    });
  });

  describe('delete', () => {
    it('should delete a game', async () => {
      const gameId = 1;
      UnoGame.findByPk.mockResolvedValue(mockGameInstance);
      mockGameInstance.destroy.mockResolvedValue();

      await UnoRepository.delete(gameId);

      expect(UnoGame.findByPk).toHaveBeenCalledWith(gameId);
      expect(mockGameInstance.destroy).toHaveBeenCalled();
    });

    it('should throw an error if game is not found', async () => {
      const gameId = 1;
      UnoGame.findByPk.mockResolvedValue(null);

      await expect(UnoRepository.delete(gameId)).rejects.toThrow('Jogo não encontrado');
    });

    it('should handle errors', async () => {
      const error = new Error('Delete error');
      UnoGame.findByPk.mockResolvedValue(mockGameInstance);
      mockGameInstance.destroy.mockRejectedValue(error);

      await expect(UnoRepository.delete(1)).rejects.toThrow('Delete error');
    });
  });
});
