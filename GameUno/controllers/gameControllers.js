const GameService = require('../services/gameServices');
const PlayerService = require('../services/playerServices');
const PlayerToCardService = require('../services/playerToCardService');
const PlayerToGameService = require('../services/playerToGameServices');



const GameController = {
  createGame: async (req, res, next) => {
    try {
      const game = await GameService.createGame(req.body);
      res.status(201).json({message: "Game created successfully", game_id: game.id});
    } catch (err) {
      next(err);
    }
  },

  getGameById: async (req, res, next) => {
    try {
      const game = await GameService.getGameById(req.params.id);
      await GameService.checkGameExists(req.params.id);
      res.status(200).json(game);
    } catch (err) {
      next(err);
    }
  },

  getGameStatusById: async (req, res, next) => {
    try {
      const game = await GameService.getGameStatusById(req.params.id);
      const gameStatus = await GameService.statusGame(game);
      res.status(200).json({GameStatus: gameStatus});
    } catch (err) {
      next(err);
    }
  },

  getAllGames: async (req, res, next) => {
    try {
      const games = await GameService.getAllGames();
      res.status(200).json(games);
    } catch (err) {
      next(err);
    }
  },

  getAllPlayersInGame: async (req, res, next) => {
    try {
      const players = await PlayerToGameService.getPlayersByGameId(req.params.id);
      res.status(200).json({game_id: req.params.id, players: players});
    } catch (err) {
      if (err.message === 'No players found') {
        res.status(401).json({ error: 'No players found'});
      } else {
        next(err);
      }
    }
  },

  getTurnGamePlayer: async (req, res, next) => {
    try {
      await PlayerToGameService.getPlayersByGameId(req.params.id);
      const playerTurn = await PlayerToGameService.turnPlayer(req.params.id);
      res.status(200).json({game_id: req.params.id, playerTurn});
    } catch (err) {
      next(err);
    }
  },

  updateGame: async (req, res, next) => {
    try {
      const game = await GameService.updateGame(req.params.id, req.body);
      res.status(200).json(game);
    } catch (err) {
      next(err);
    }
  },

  deleteGame: async (req, res, next) => {
    try {
      await GameService.deleteGame(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  playerStartGame: async (req, res, next) => {
    try {
      const { gameid, access_token } = req.body;
      await PlayerToGameService.startGame(gameid, access_token);
      res.status(200).json({message: "Game started successfully" });
    } catch (err) {
      if (err.message === 'User logged out') {
        res.status(401).json({ error: 'User logged out'});
      } else {
        if (err.message === 'No players found') {
          res.status(401).json({ error: 'No players found'});
        }else if(err.message === 'game already in progress'){
          res.status(401).json({ error: 'game already in progress'});
        }else if(err.message === 'player not being in the game'){
          res.status(401).json({ error: 'player not being in the game'});
        }else if(err.message === 'insufficient players'){
          res.status(401).json({ error: 'insufficient players'});
        }else {
          next(err);
        }
      }
    }
  },

  playerEndGame: async (req, res, next) => {
    try {
      const { gameid, access_token } = req.body;
      await PlayerToGameService.endGame(gameid, access_token);
      res.status(200).json({message: "Game ended successfully" });

    } catch (err) {
      if (err.message === 'User logged out') {
        res.status(401).json({ error: 'User logged out'});
      }else if(err.message === 'game is stopped'){
        res.status(401).json({ error: 'game is stopped'});
      }else if(err.message === 'player not being in the game'){
        res.status(401).json({ error: 'player not being in the game'});
      }else if(err.message === 'player does not own the game'){
        res.status(401).json({ error: 'player does not own the game'});
      }else {
        next(err);
      }
    }
  },

  


  updateGamePartial: async (req, res, next) => {
    try {
      const game = await GameService.updateGamePartial(req.params.id, req.body);
      res.status(200).json(game);
    } catch (err) {
      next(err);
    }
  },

  playerGetAllGameData: async (req, res, next) => {
    try {
      const playersAndCards = await PlayerToGameService.getAllPlayersAndCards(req.params.id);
      const playerTurn = await PlayerToGameService.turnPlayer(req.params.id);
      const topCardDeck = await GameService.getTopCard(req.params.id);
      const gameHistory = await PlayerToCardService.getGameHistory();
      res.status(200).json({currentPlayer: playerTurn, topCard:topCardDeck, hands: playersAndCards, turnHistory: gameHistory});
    } catch (err) {
      next(err);
    }
  },

  getTopCardgame: async (req, res, next) => {
    try {
      const topCardDeck = await GameService.getTopCard(req.params.id);
      res.status(200).json({topCardDeck});
    } catch (err) {
      next(err);
    }
  },

  gameTurnHistory: async (req, res, next) => {
    try {
      const gameHistory = await PlayerToCardService.getGameHistory();
      res.status(200).json({turnHistory: gameHistory});
    } catch (err) {
      next(err);
    }
  }
};

module.exports = GameController;
