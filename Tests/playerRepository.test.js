const PlayerRepository = require('../GameUno/repositories/playerRepository');
const UnoPlayer = require('../GameUno/models/playerModels');

jest.mock('../GameUno/models/playerModels');

describe('PlayerRepository', () => {
  let mockPlayerInstance;

  beforeEach(() => {
    mockPlayerInstance = {
      update: jest.fn(),
      destroy: jest.fn()
    };

    UnoPlayer.create.mockResolvedValue(mockPlayerInstance);
    UnoPlayer.findByPk.mockResolvedValue(mockPlayerInstance);
    UnoPlayer.findOne.mockResolvedValue(mockPlayerInstance);
    UnoPlayer.findAll.mockResolvedValue([mockPlayerInstance]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new player', async () => {
      const playerData = { name: 'John Doe', email: 'john.doe@example.com', password: 'password' };
      UnoPlayer.create.mockResolvedValue(playerData);

      const result = await PlayerRepository.create(playerData);

      expect(UnoPlayer.create).toHaveBeenCalledWith(playerData);
      expect(result).toEqual(playerData);
    });

    it('should handle errors', async () => {
      const error = new Error('Creation error');
      UnoPlayer.create.mockRejectedValue(error);

      await expect(PlayerRepository.create({})).rejects.toThrow('Creation error');
    });
  });

  describe('findById', () => {
    it('should find a player by id', async () => {
      const playerId = 1;
      const playerData = { id: playerId, name: 'John Doe' };
      UnoPlayer.findByPk.mockResolvedValue(playerData);

      const result = await PlayerRepository.findById(playerId);

      expect(UnoPlayer.findByPk).toHaveBeenCalledWith(playerId);
      expect(result).toEqual(playerData);
    });

    it('should return null if player is not found', async () => {
      const playerId = 1;
      UnoPlayer.findByPk.mockResolvedValue(null);

      const result = await PlayerRepository.findById(playerId);

      expect(UnoPlayer.findByPk).toHaveBeenCalledWith(playerId);
      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      const error = new Error('Find error');
      UnoPlayer.findByPk.mockRejectedValue(error);

      await expect(PlayerRepository.findById(1)).rejects.toThrow('Find error');
    });
  });

  describe('findByEmail', () => {
    it('should find a player by email', async () => {
      const playerEmail = 'john.doe@example.com';
      const playerData = { email: playerEmail, name: 'John Doe' };
      UnoPlayer.findOne.mockResolvedValue(playerData);

      const result = await PlayerRepository.findByEmail(playerEmail);

      expect(UnoPlayer.findOne).toHaveBeenCalledWith({ where: { email: playerEmail } });
      expect(result).toEqual(playerData);
    });

    it('should return null if player is not found by email', async () => {
      const playerEmail = 'john.doe@example.com';
      UnoPlayer.findOne.mockResolvedValue(null);

      const result = await PlayerRepository.findByEmail(playerEmail);

      expect(UnoPlayer.findOne).toHaveBeenCalledWith({ where: { email: playerEmail } });
      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      const error = new Error('Find by email error');
      UnoPlayer.findOne.mockRejectedValue(error);

      await expect(PlayerRepository.findByEmail('john.doe@example.com')).rejects.toThrow('Find by email error');
    });
  });

  describe('findByPassword', () => {
    it('should find a player by password', async () => {
      const playerPassword = 'password';
      const playerData = { userpassword: playerPassword, name: 'John Doe' };
      UnoPlayer.findOne.mockResolvedValue(playerData);

      const result = await PlayerRepository.findByPassword(playerPassword);

      expect(UnoPlayer.findOne).toHaveBeenCalledWith({ where: { userpassword: playerPassword } });
      expect(result).toEqual(playerData);
    });

    it('should return null if player is not found by password', async () => {
      const playerPassword = 'password';
      UnoPlayer.findOne.mockResolvedValue(null);

      const result = await PlayerRepository.findByPassword(playerPassword);

      expect(UnoPlayer.findOne).toHaveBeenCalledWith({ where: { userpassword: playerPassword } });
      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      const error = new Error('Find by password error');
      UnoPlayer.findOne.mockRejectedValue(error);

      await expect(PlayerRepository.findByPassword('password')).rejects.toThrow('Find by password error');
    });
  });

  describe('findAll', () => {
    it('should return all players', async () => {
      const players = [{ id: 1, name: 'John Doe' }];
      UnoPlayer.findAll.mockResolvedValue(players);

      const result = await PlayerRepository.findAll();

      expect(UnoPlayer.findAll).toHaveBeenCalled();
      expect(result).toEqual(players);
    });

    it('should handle errors', async () => {
      const error = new Error('Find all error');
      UnoPlayer.findAll.mockRejectedValue(error);

      await expect(PlayerRepository.findAll()).rejects.toThrow('Find all error');
    });
  });

  describe('findAllByGameId', () => {
    it('should return all players by gameId', async () => {
      const gameId = 1;
      const players = [{ nameplayer: 'John Doe' }];
      UnoPlayer.findAll.mockResolvedValue(players);

      const result = await PlayerRepository.findAllByGameId(gameId);

      expect(UnoPlayer.findAll).toHaveBeenCalledWith({ where: { gameid: gameId }, attributes: ['nameplayer'] });
      expect(result).toEqual(players);
    });

    it('should handle errors', async () => {
      const error = new Error('Find by gameId error');
      UnoPlayer.findAll.mockRejectedValue(error);

      await expect(PlayerRepository.findAllByGameId(1)).rejects.toThrow('Find by gameId error');
    });
  });

  describe('update', () => {
    it('should update an existing player', async () => {
      const playerId = 1;
      const playerData = { name: 'John Smith' };
      const updatedPlayer = { id: playerId, name: 'John Smith' };
      UnoPlayer.findByPk.mockResolvedValue({ ...mockPlayerInstance, ...playerData });
      mockPlayerInstance.update.mockResolvedValue(updatedPlayer);

      const result = await PlayerRepository.update(playerId, playerData);

      expect(UnoPlayer.findByPk).toHaveBeenCalledWith(playerId);
      expect(mockPlayerInstance.update).toHaveBeenCalledWith(playerData);
      expect(result).toEqual(updatedPlayer);
    });

    it('should throw an error if player is not found', async () => {
      const playerId = 1;
      const playerData = { name: 'John Smith' };
      UnoPlayer.findByPk.mockResolvedValue(null);

      await expect(PlayerRepository.update(playerId, playerData)).rejects.toThrow('player not found');
    });

    it('should handle errors', async () => {
      const error = new Error('Update error');
      UnoPlayer.findByPk.mockResolvedValue(mockPlayerInstance);
      mockPlayerInstance.update.mockRejectedValue(error);

      await expect(PlayerRepository.update(1, {})).rejects.toThrow('Update error');
    });
  });

  describe('delete', () => {
    it('should delete a player', async () => {
      const playerId = 1;
      UnoPlayer.findByPk.mockResolvedValue(mockPlayerInstance);
      mockPlayerInstance.destroy.mockResolvedValue();

      await PlayerRepository.delete(playerId);

      expect(UnoPlayer.findByPk).toHaveBeenCalledWith(playerId);
      expect(mockPlayerInstance.destroy).toHaveBeenCalled();
    });

    it('should throw an error if player is not found', async () => {
      const playerId = 1;
      UnoPlayer.findByPk.mockResolvedValue(null);

      await expect(PlayerRepository.delete(playerId)).rejects.toThrow('player not found');
    });

    it('should handle errors', async () => {
      const error = new Error('Delete error');
      UnoPlayer.findByPk.mockResolvedValue(mockPlayerInstance);
      mockPlayerInstance.destroy.mockRejectedValue(error);

      await expect(PlayerRepository.delete(1)).rejects.toThrow('Delete error');
    });
  });
});
