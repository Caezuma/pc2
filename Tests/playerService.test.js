const PlayerService = require('../GameUno/services/playerServices');
const PlayerRepository = require('../GameUno/repositories/playerRepository');

const GameService = require('../GameUno/services/gameServices');

const jwt = require('jsonwebtoken');

jest.mock('../GameUno/repositories/playerRepository');
jest.mock('jsonwebtoken');

describe('PlayerService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPlayer', () => {
    it('should create a new player', async () => {
      const playerData = { email: 'test@test.com' };
      PlayerRepository.findByEmail.mockResolvedValue(null);
      PlayerRepository.create.mockResolvedValue(playerData);

      const result = await PlayerService.createPlayer(playerData);

      expect(PlayerRepository.findByEmail).toHaveBeenCalledWith(playerData.email);
      expect(PlayerRepository.create).toHaveBeenCalledWith(playerData);
      expect(result).toEqual(playerData);
    });

    it('should throw an error if player already exists', async () => {
      const playerData = { email: 'test@test.com' };
      PlayerRepository.findByEmail.mockResolvedValue(playerData);

      await expect(PlayerService.createPlayer(playerData)).rejects.toThrow('User already exists');
    });
  });

  describe('loginPlayer', () => {
    it('should return a token for valid credentials', async () => {
      const playerData = { email: 'test@test.com', userpassword: 'password' };
      PlayerRepository.findByEmail.mockResolvedValue(playerData);
      jwt.sign.mockReturnValue('token');

      const result = await PlayerService.loginPlayer(playerData.email, playerData.userpassword);

      expect(PlayerRepository.findByEmail).toHaveBeenCalledWith(playerData.email);
      expect(jwt.sign).toHaveBeenCalledWith({
        id: playerData.id,
        nameplayer: playerData.nameplayer,
        email: playerData.email,
        gameid: playerData.gameid
      }, 'senha', { expiresIn: "2h" });
      expect(result).toEqual('token');
    });

    it('should throw an error for invalid credentials', async () => {
      const playerData = { email: 'test@test.com', userpassword: 'wrongpassword' };
      PlayerRepository.findByEmail.mockResolvedValue(playerData);
      await expect(PlayerService.loginPlayer(playerData.email, 'wrongssword')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('updatePlayer', () => {
    it('should update player data', async () => {
        const playerId = 1;
        const updateData = { id: 1, nameplayer: 'Update', age: 1, email: 'test@test.com', password: 'senha123', gameid: 1};
        const updatedPlayer = {id: 1, nameplayer: 'Update', age: 1, email: 'test@test.com', password: 'senha123', gameid: 1};
      
        PlayerRepository.update.mockResolvedValue([1, [updatedPlayer]]);
      
        const result = (await PlayerService.updatePlayer(playerId, updateData))[1][0];
      
        expect(PlayerRepository.update).toHaveBeenCalledWith(playerId, updateData);
        expect(result).toEqual(updatedPlayer);
      });
      
  });

  describe('deletePlayer', () => {
    it('should delete a player', async () => {
      const playerId = 1;

      PlayerRepository.delete.mockResolvedValue(1);

         result = await PlayerService.deletePlayer(playerId);

      expect(PlayerRepository.delete).toHaveBeenCalledWith(playerId);
      expect(result).toBe(1);
    });

    it('should throw an error if player does not exist', async () => {
      const playerId = 1;

      PlayerRepository.delete.mockResolvedValue(0);

      await expect(PlayerService.deletePlayer(playerId)).rejects.toThrow('Player not found');
    });
  });

  describe('logoutPlayer', () => {
    const validToken = 'valid-token';
     const invalidToken = 'invalid-token';
    it('should return success message on valid logout', async () => {
        const result = await PlayerService.logoutPlayer(validToken);
        expect(result).toEqual({ message: 'User logged out successfully' });
    });
  });

  describe('getPlayerByToken', () => {
    it('should return player details when given a valid token', async () => {
      const token = 'valid-token';
      const decodedToken = { id: 1, nameplayer: 'Player1', email: 'player1@test.com', gameid: 1 };
      jwt.decode.mockReturnValue(decodedToken);
  
      const result = await PlayerService.getPlayerByToken(token);
  
      expect(jwt.decode).toHaveBeenCalledWith(token, 'senha');
      expect(result).toEqual(decodedToken);
    });
  
    it('should throw an error when the token is invalid', async () => {
      const token = 'invalid-token';
      jwt.decode.mockImplementation(() => {
        throw new Error('Invalid token');
      });
  
      await expect(PlayerService.getPlayerByToken(token)).rejects.toThrow('Invalid token');
    });
  });


  describe('joinExistingGame', () => {
    it('should join an existing game successfully', async () => {
      const gameId = 1;
      const playerId = 1;
      const playerData = { id: playerId, gameid: gameId };
      
      PlayerRepository.update.mockResolvedValue([1, [playerData]]);

      const result = await PlayerService.addPlayerToGame(playerId, { gameid: gameId });

      expect(PlayerRepository.update).toHaveBeenCalledWith(playerId, { gameid: gameId });
      expect(result[1][0]).toEqual(playerData);
    });
  });

  describe('addPlayerToGame', () => {
    it('should add a player to an existing game', async () => {
      const playerId = 1;
      const gameId = 1;
      const playerData = { id: playerId, gameid: gameId };
      
      PlayerRepository.update.mockResolvedValue([1, [playerData]]);

      const result = await PlayerService.addPlayerToGame(playerId, { gameid: gameId });

      expect(PlayerRepository.update).toHaveBeenCalledWith(playerId, { gameid: gameId });
      expect(result[1][0]).toEqual(playerData);
    });
  });


  describe('leavePlayerToGame', () => {
    it('should leave a player to an existing game', async () => {
      const playerId = 1;
      const gameId = null;
      const playerData = { id: playerId, gameid: gameId };
      
      PlayerRepository.update.mockResolvedValue([1, [playerData]]);

      const result = await PlayerService.leavePlayerToGame(playerId, { gameid: gameId });

      expect(PlayerRepository.update).toHaveBeenCalledWith(playerId, { gameid: gameId });
      expect(result[1][0]).toEqual(playerData);
    });
  });

  describe('getIdByToken', () => {
    it('should return the player ID from a valid token', async () => {
      const token = 'valid-token';
      const decodedToken = { id: 1 };
      jwt.verify.mockReturnValue(decodedToken);

      const result = await PlayerService.getIdByToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, 'senha');
      expect(result).toEqual(1);
    });

    describe('getGameidById', () => {
      it('should return the game ID from the player ID', async () => {
        const playerId = 1;
        const playerData = { gameid: 1 };
        PlayerRepository.findById.mockResolvedValue(playerData);
  
        const result = await PlayerService.getGameidById(playerId);
  
        expect(PlayerRepository.findById).toHaveBeenCalledWith(playerId);
        expect(result).toEqual(1);
      });
    });
  
    describe('getNamePlayerById', () => {
      it('should return the player name from the player ID', async () => {
        const playerId = 1;
        const playerData = { nameplayer: 'Player1' };
        PlayerRepository.findById.mockResolvedValue(playerData);
  
        const result = await PlayerService.getNamePlayerById(playerId);
  
        expect(PlayerRepository.findById).toHaveBeenCalledWith(playerId);
        expect(result).toEqual('Player1');
      });
    });
  
    describe('getPlayerById', () => {
      it('should return the player by ID', async () => {
        const playerId = 1;
        const playerData = { id: playerId };
        PlayerRepository.findById.mockResolvedValue(playerData);
  
        const result = await PlayerService.getPlayerById(playerId);
  
        expect(PlayerRepository.findById).toHaveBeenCalledWith(playerId);
        expect(result).toEqual(playerData);
      });
    });
  
    describe('getAllPlayers', () => {
      it('should return all players', async () => {
        const players = [{ id: 1 }, { id: 2 }];
        PlayerRepository.findAll.mockResolvedValue(players);
  
        const result = await PlayerService.getAllPlayers();
  
        expect(PlayerRepository.findAll).toHaveBeenCalled();
        expect(result).toEqual(players);
      });
    });
  
    describe('tokenValidate', () => {
      it('should throw an error if the token is in the blacklist', async () => {
        const token = 'blacklisted-token';
        PlayerService.logoutPlayer(token); // Add token to blacklist
  
        await expect(PlayerService.tokenValidate(token)).rejects.toThrow('User logged out');
      });
    });
  });
  
});
