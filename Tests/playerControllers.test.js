const PlayerController = require('../GameUno/controllers/playerControllers');
const PlayerService = require('../GameUno/services/playerServices');
const GameService = require('../GameUno/services/gameServices');

jest.mock('../GameUno/services/playerServices');
jest.mock('../GameUno/services/gameServices');

describe('PlayerController', () => {
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

  describe('createPlayer', () => {
    it('should create a player successfully', async () => {
      const gameid = 1;
      const playerData = { email: 'test@test.com', userpassword: 'password', gameid: 1};
      mockReq.body = { ...playerData, gameid : 1};

      GameService.checkGameExists.mockResolvedValue();
      PlayerService.createPlayer.mockResolvedValue();

      await PlayerController.createPlayer(mockReq, mockRes, mockNext);

      expect(GameService.checkGameExists).toHaveBeenCalledWith(gameid);
      expect(PlayerService.createPlayer).toHaveBeenCalledWith(playerData, gameid);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
    });

    it('should return 400 if user already exists', async () => {
      const error = new Error('User already exists');
      mockReq.body = { email: 'test@test.com', userpassword: 'password', gameid: 1 };

      GameService.checkGameExists.mockResolvedValue();
      PlayerService.createPlayer.mockRejectedValue(error);

      await PlayerController.createPlayer(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User already exists' });
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      GameService.checkGameExists.mockRejectedValue(error);

      await PlayerController.createPlayer(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('playerLeaveGame', () => {
    it('should let player leave the game', async () => {
      const playerData = { id: 1, nameplayer: 'Player1', gameid: null };
      const token = 'valid-token';
      mockReq.body = { access_token: token, gameid: null };
      PlayerService.tokenValidate.mockResolvedValue();
      PlayerService.getIdByToken.mockResolvedValue(1);
      PlayerService.leavePlayerToGame.mockResolvedValue(playerData);

      await PlayerController.playerLeaveGame(mockReq, mockRes, mockNext);

      expect(PlayerService.tokenValidate).toHaveBeenCalledWith(token);
      expect(PlayerService.getIdByToken).toHaveBeenCalledWith(token);
      expect(PlayerService.leavePlayerToGame).toHaveBeenCalledWith(1, { gameid: null });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ player: playerData.nameplayer, game_id: playerData.gameid, message: "User left the game successfully" });
    });

    it('should return 401 if user is logged out', async () => {
      const error = new Error('User logged out');
      mockReq.body = { access_token: 'invalid-token' };
      PlayerService.tokenValidate.mockRejectedValue(error);

      await PlayerController.playerLeaveGame(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User logged out' });
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      PlayerService.tokenValidate.mockRejectedValue(error);

      await PlayerController.playerLeaveGame(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('loginPlayer', () => {
    it('should return a token for valid credentials', async () => {
      const playerData = { email: 'test@test.com', userpassword: 'password' };
      const token = 'valid-token';
      mockReq.body = playerData;
      PlayerService.loginPlayer.mockResolvedValue(token);

      await PlayerController.loginPlayer(mockReq, mockRes, mockNext);

      expect(PlayerService.loginPlayer).toHaveBeenCalledWith(playerData.email, playerData.userpassword);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ access_token: token });
    });
  });

  describe('updatePlayer', () => {
    it('should update player data', async () => {
      const playerData = { id: 1, email: 'updated@test.com' };
      mockReq.params.id = 1;
      mockReq.body = playerData;
      PlayerService.updatePlayer.mockResolvedValue(playerData);

      await PlayerController.updatePlayer(mockReq, mockRes, mockNext);

      expect(PlayerService.updatePlayer).toHaveBeenCalledWith(1, playerData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(playerData);
    });

    it('should return 401 if player is not found', async () => {
      const error = new Error('Player not found');
      mockReq.params.id = 1;
      mockReq.body = {};
      PlayerService.updatePlayer.mockRejectedValue(error);

      await PlayerController.updatePlayer(mockReq, mockRes, mockNext);

      expect(PlayerService.updatePlayer).toHaveBeenCalledWith(1, {});
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Player not found' });
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      PlayerService.updatePlayer.mockRejectedValue(error);

      await PlayerController.updatePlayer(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('addUserGameIdByToken', () => {
    it('should add a game to a player with a valid token', async () => {
      const playerData = { id: 1, nameplayer: 'Player1', gameid: 1 };
      const token = 'valid-token';
      mockReq.body = { access_token: token, gameid: 1 };
  
      PlayerService.tokenValidate.mockResolvedValue();
      PlayerService.getIdByToken.mockResolvedValue(1);
      PlayerService.addPlayerToGame.mockResolvedValue(playerData);
  
      await PlayerController.addUserGameIdByToken(mockReq, mockRes, mockNext);
  
      expect(PlayerService.tokenValidate).toHaveBeenCalledWith(token);
      expect(PlayerService.getIdByToken).toHaveBeenCalledWith(token);
      expect(PlayerService.addPlayerToGame).toHaveBeenCalledWith(1, { gameid: 1 });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ player: playerData.nameplayer, game_id: playerData.gameid, message: "User joined the game successfully" });
    });
  
    it('should return 401 if user is logged out', async () => {
      const error = new Error('User logged out');
      const token = 'invalid-token';
      mockReq.body = { access_token: token, gameid: 1 };
  
      PlayerService.tokenValidate.mockRejectedValue(error);
  
      await PlayerController.addUserGameIdByToken(mockReq, mockRes, mockNext);
  
      expect(PlayerService.tokenValidate).toHaveBeenCalledWith(token);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User logged out' });
    });
  
    it('should handle errors', async () => {
      const error = new Error('error');
      const token = 'valid-token';
      mockReq.body = { access_token: token, gameid: 1 };
  
      PlayerService.tokenValidate.mockRejectedValue(error);
  
      await PlayerController.addUserGameIdByToken(mockReq, mockRes, mockNext);
  
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  

  describe('updatePlayerPartial', () => {
    it('should update player data partially', async () => {
      const playerData = { email: 'partial-update@test.com' };
      mockReq.params.id = 1;
      mockReq.body = playerData;
      PlayerService.updatePlayerPartial.mockResolvedValue(playerData);

      await PlayerController.updatePlayerPartial(mockReq, mockRes, mockNext);

      expect(PlayerService.updatePlayerPartial).toHaveBeenCalledWith(1, playerData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(playerData);
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      PlayerService.updatePlayerPartial.mockRejectedValue(error);

      await PlayerController.updatePlayerPartial(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deletePlayer', () => {
    it('should delete a player by ID', async () => {
      mockReq.params.id = 1;
      PlayerService.deletePlayer.mockResolvedValue();

      await PlayerController.deletePlayer(mockReq, mockRes, mockNext);

      expect(PlayerService.deletePlayer).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.end).toHaveBeenCalled();
    });

    it('should return 401 if player is not found', async () => {
      const error = new Error('Player not found');
      mockReq.params.id = 1;
      PlayerService.deletePlayer.mockRejectedValue(error);

      await PlayerController.deletePlayer(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Player not found' });
    });
 
    it('should handle errors', async () => {
      const error = new Error('error');
      PlayerService.deletePlayer.mockRejectedValue(error);

      await PlayerController.deletePlayer(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getPlayerById', () => {
    it('should return player data by ID', async () => {
      const playerData = { id: 1, email: 'test@test.com' };
      mockReq.params.id = 1;
      PlayerService.getPlayerById.mockResolvedValue(playerData);

      await PlayerController.getPlayerById(mockReq, mockRes, mockNext);

      expect(PlayerService.getPlayerById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(playerData);
    });

    it('should return 404 if player is not found', async () => {
      mockReq.params.id = 1;
      PlayerService.getPlayerById.mockResolvedValue(null);

      await PlayerController.getPlayerById(mockReq, mockRes, mockNext);

      expect(PlayerService.getPlayerById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Player not found' });
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      PlayerService.getPlayerById.mockRejectedValue(error);

      await PlayerController.getPlayerById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllPlayers', () => {
    it('should return a list of all players', async () => {
      const players = [{ id: 1, email: 'test@test.com' }];
      PlayerService.getAllPlayers.mockResolvedValue(players);

      await PlayerController.getAllPlayers(mockReq, mockRes, mockNext);

      expect(PlayerService.getAllPlayers).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(players);
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      PlayerService.getAllPlayers.mockRejectedValue(error);

      await PlayerController.getAllPlayers(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  

  describe('getPlayerByToken', () => {
    it('should return player data by token', async () => {
      const playerData = { id: 1, email: 'test@test.com' };
      const token = 'valid-token';
      mockReq.body = { access_token: token };

      PlayerService.tokenValidate.mockResolvedValue();
      PlayerService.getPlayerByToken.mockResolvedValue(playerData);

      await PlayerController.getPlayerByToken(mockReq, mockRes, mockNext);

      expect(PlayerService.tokenValidate).toHaveBeenCalledWith(token);
      expect(PlayerService.getPlayerByToken).toHaveBeenCalledWith(token);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(playerData);
    });

    it('should return 401 if user is logged out', async () => {
      const error = new Error('User logged out');
      mockReq.body = { access_token: 'invalid-token' };

      PlayerService.tokenValidate.mockRejectedValue(error);

      await PlayerController.getPlayerByToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User logged out' });
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      PlayerService.tokenValidate.mockRejectedValue(error);

      await PlayerController.getPlayerByToken(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

   
