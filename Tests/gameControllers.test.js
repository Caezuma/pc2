const GameController = require('../GameUno/controllers/gameControllers');
const GameService = require('../GameUno/services/gameServices');
const PlayerService = require('../GameUno/services/playerServices');
const PlayerToCardService = require('../GameUno/services/playerToCardService');
const PlayerToGameService = require('../GameUno/services/playerToGameServices');

jest.mock('../GameUno/services/gameServices');
jest.mock('../GameUno/services/playerServices');
jest.mock('../GameUno/services/playerToCardService');
jest.mock('../GameUno/services/playerToGameServices');

describe('GameController', () => {
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

  describe('createGame', () => {
    it('should create a game successfully', async () => {
      const game = { id: 1 };
      mockReq.body = { name: 'New Game' };
      GameService.createGame.mockResolvedValue(game);

      await GameController.createGame(mockReq, mockRes, mockNext);

      expect(GameService.createGame).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Game created successfully', game_id: game.id });
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      GameService.createGame.mockRejectedValue(error);

      await GameController.createGame(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getGameById', () => {
    it('should return game data for a valid ID', async () => {
      const game = { id: 1, name: 'Existing Game' };
      mockReq.params.id = 1;
      GameService.getGameById.mockResolvedValue(game);
      GameService.checkGameExists.mockResolvedValue();

      await GameController.getGameById(mockReq, mockRes, mockNext);

      expect(GameService.getGameById).toHaveBeenCalledWith(1);
      expect(GameService.checkGameExists).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(game);
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      GameService.getGameById.mockRejectedValue(error);

      await GameController.getGameById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getGameStatusById', () => {
    it('should return game status for a valid ID', async () => {
      const game = { id: 1 };
      const gameStatus = 'In Progress';
      mockReq.params.id = 1;
      GameService.getGameStatusById.mockResolvedValue(game);
      GameService.statusGame.mockResolvedValue(gameStatus);

      await GameController.getGameStatusById(mockReq, mockRes, mockNext);

      expect(GameService.getGameStatusById).toHaveBeenCalledWith(1);
      expect(GameService.statusGame).toHaveBeenCalledWith(game);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ GameStatus: gameStatus });
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      GameService.getGameStatusById.mockRejectedValue(error);

      await GameController.getGameStatusById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllGames', () => {
    it('should return a list of all games', async () => {
      const games = [{ id: 1, name: 'Game 1' }];
      GameService.getAllGames.mockResolvedValue(games);

      await GameController.getAllGames(mockReq, mockRes, mockNext);

      expect(GameService.getAllGames).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(games);
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      GameService.getAllGames.mockRejectedValue(error);

      await GameController.getAllGames(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateGame', () => {
    it('should update game data', async () => {
      const updatedGame = { id: 1, name: 'Updated Game' };
      mockReq.params.id = 1;
      mockReq.body = { name: 'Updated Game' };
      GameService.updateGame.mockResolvedValue(updatedGame);

      await GameController.updateGame(mockReq, mockRes, mockNext);

      expect(GameService.updateGame).toHaveBeenCalledWith(1, mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedGame);
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      GameService.updateGame.mockRejectedValue(error);

      await GameController.updateGame(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteGame', () => {
    it('should delete a game by ID', async () => {
      mockReq.params.id = 1;
      GameService.deleteGame.mockResolvedValue();

      await GameController.deleteGame(mockReq, mockRes, mockNext);

      expect(GameService.deleteGame).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.end).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      GameService.deleteGame.mockRejectedValue(error);

      await GameController.deleteGame(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateGamePartial', () => {
    it('should partially update game data', async () => {
      const updatedGame = { id: 1, name: 'Partially Updated Game' };
      mockReq.params.id = 1;
      mockReq.body = { name: 'Partially Updated Game' };
      GameService.updateGamePartial.mockResolvedValue(updatedGame);

      await GameController.updateGamePartial(mockReq, mockRes, mockNext);

      expect(GameService.updateGamePartial).toHaveBeenCalledWith(1, mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedGame);
    });

    it('should handle errors', async () => {
      const error = new Error('error');
      GameService.updateGamePartial.mockRejectedValue(error);

      await GameController.updateGamePartial(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllPlayersInGame', () => {
    it('should return a list of players for a valid game ID', async () => {
      const players = [{ id: 1, name: 'Player 1' }];
      mockReq.params.id = 1;
      PlayerToGameService.getPlayersByGameId.mockResolvedValue(players);

      await GameController.getAllPlayersInGame(mockReq, mockRes, mockNext);

      expect(PlayerToGameService.getPlayersByGameId).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ game_id: 1, players });
    });

    it('should handle errors when no players are found', async () => {
      const error = new Error('No players found');
      PlayerToGameService.getPlayersByGameId.mockRejectedValue(error);

      await GameController.getAllPlayersInGame(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No players found' });
    });

    it('should handle other errors', async () => {
      const error = new Error('Unexpected error');
      PlayerToGameService.getPlayersByGameId.mockRejectedValue(error);

      await GameController.getAllPlayersInGame(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getTurnGamePlayer', () => {
    it('should return the current player turn for a valid game ID', async () => {
      const playerTurn = { id: 1, name: 'Player 1' };
      mockReq.params.id = 1;
      PlayerToGameService.getPlayersByGameId.mockResolvedValue([{ id: 1 }]);
      PlayerToGameService.turnPlayer.mockResolvedValue(playerTurn);

      await GameController.getTurnGamePlayer(mockReq, mockRes, mockNext);

      expect(PlayerToGameService.getPlayersByGameId).toHaveBeenCalledWith(1);
      expect(PlayerToGameService.turnPlayer).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ game_id: 1, playerTurn });
    });

    it('should handle errors when unable to get players or determine the turn', async () => {
      const error = new Error('Unexpected error');
      PlayerToGameService.getPlayersByGameId.mockRejectedValue(error);

      await GameController.getTurnGamePlayer(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('playerStartGame', () => {
    it('should start the game successfully', async () => {
      mockReq.body = { gameid: 1, access_token: 'token123' };
      PlayerToGameService.startGame.mockResolvedValue();

      await GameController.playerStartGame(mockReq, mockRes, mockNext);

      expect(PlayerToGameService.startGame).toHaveBeenCalledWith(1, 'token123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Game started successfully" });
    });

    it('should handle errors related to user login status', async () => {
      const error = new Error('User logged out');
      PlayerToGameService.startGame.mockRejectedValue(error);

      await GameController.playerStartGame(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User logged out' });
    });

    it('should handle errors when no players are found', async () => {
      const error = new Error('No players found');
      PlayerToGameService.startGame.mockRejectedValue(error);

      await GameController.playerStartGame(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No players found' });
    });

    it('should handle other game-related errors', async () => {
      const error = new Error('Game already in progress');
      PlayerToGameService.startGame.mockRejectedValue(error);

      await GameController.playerStartGame(mockReq, mockRes, mockNext);
    });
  });

  describe('playerEndGame', () => {
    it('should end the game successfully', async () => {
      mockReq.body = { gameid: 1, access_token: 'token123' };
      PlayerToGameService.endGame.mockResolvedValue();
      await GameController.playerEndGame(mockReq, mockRes, mockNext);
      expect(PlayerToGameService.endGame).toHaveBeenCalledWith(1, 'token123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Game ended successfully" });
    });

    it('should handle errors related to user login status', async () => {
      const error = new Error('User logged out');
      PlayerToGameService.endGame.mockRejectedValue(error);
      await GameController.playerEndGame(mockReq, mockRes, mockNext);
    });

    it('should handle errors when the game is stopped', async () => {
      const error = new Error('Game is stopped');
      PlayerToGameService.endGame.mockRejectedValue(error);
      await GameController.playerEndGame(mockReq, mockRes, mockNext);
    });

    it('should handle other game-related errors', async () => {
      const error = new Error('Player not being in the game');
      PlayerToGameService.endGame.mockRejectedValue(error);

      await GameController.playerEndGame(mockReq, mockRes, mockNext);
    });
  });

  describe('playerGetAllGameData', () => {
    it('should return all game data', async () => {
      const playersAndCards = [{ id: 1, cards: ['Card1'] }];
      const playerTurn = { id: 1, name: 'Player 1' };
      const topCardDeck = 'TopCard';
      const gameHistory = [{ turn: 1, action: 'Draw Card' }];
      mockReq.params.id = 1;
      PlayerToGameService.getAllPlayersAndCards.mockResolvedValue(playersAndCards);
      PlayerToGameService.turnPlayer.mockResolvedValue(playerTurn);
      GameService.getTopCard.mockResolvedValue(topCardDeck);
      PlayerToCardService.getGameHistory.mockResolvedValue(gameHistory);

      await GameController.playerGetAllGameData(mockReq, mockRes, mockNext);

      expect(PlayerToGameService.getAllPlayersAndCards).toHaveBeenCalledWith(1);
      expect(PlayerToGameService.turnPlayer).toHaveBeenCalledWith(1);
      expect(GameService.getTopCard).toHaveBeenCalledWith(1);
      expect(PlayerToCardService.getGameHistory).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors when unable to retrieve game data', async () => {
      const error = new Error('Failed to retrieve game data');
      PlayerToGameService.getAllPlayersAndCards.mockRejectedValue(error);

      await GameController.playerGetAllGameData(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });


});
