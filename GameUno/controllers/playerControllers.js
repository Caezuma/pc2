const PlayerService = require('../services/playerServices');
const GameService = require('../services/gameServices');

const PlayerController = {

  createPlayer: async (req, res, next) => {
    try {
      const { gameid } = req.body;
      await GameService.checkGameExists(gameid);
      await PlayerService.createPlayer(req.body, gameid);
      res.status(200).json({message: "User registered successfully"});
    } catch (err) {
      if (err.message === "User already exists") {
        res.status(400).json({ error: "User already exists" });
      } else {
        next(err);
      }
    }
  },
  
  loginPlayer: async (req, res, next) => {
    try {
      const { email, userpassword } = req.body;
      const token = await PlayerService.loginPlayer(email, userpassword);
      res.status(200).json({ access_token: token });
    } catch (err) {
      if (err.message === 'Invalid credentials') {
        res.status(401).json({ error: 'Invalid credentials' });
      } else {
        next(err);
      }
    }
  },

  logoutPlayer: async (req, res, next) => {
    try {
      const {access_token} = req.body;
      PlayerService.logoutPlayer(access_token);
      res.status(200).json({ message: 'User logged out successfully'});
    } catch (err) {
      if (err.message === 'User logged out') {
        res.status(401).json({ error: 'User logged out' });
      } else {
        next(err);
      }
    }
  },

  getPlayerByToken: async (req, res, next) => {
    try {
      const {access_token} = req.body;
      await PlayerService.tokenValidate(access_token);
      res.status(200).json(await PlayerService.getPlayerByToken(access_token));
    } catch (err) {
      if (err.message === 'User logged out') {
        res.status(401).json({ error: 'User logged out'});
      } else {
        next(err);
      }
    }
  },

  getPlayerById: async (req, res, next) => {
    try {
      const player = await PlayerService.getPlayerById(req.params.id);
      if (!player) {
        res.status(404).json({ error: 'Player not found' });
        return;
      }
      res.status(200).json(player);
    } catch (err) {
      next(err);
    }
  },

  getAllPlayers: async (req, res, next) => {
    try {
      const players = await PlayerService.getAllPlayers();
      res.status(200).json(players);
    } catch (err) {
      next(err);
    }
  },

  updatePlayer: async (req, res, next) => {
    try {
      const player = await PlayerService.updatePlayer(req.params.id, req.body);
      res.status(200).json(player);
    } catch (err) {
      if (err.message === 'Player not found') {
        res.status(401).json({ error: 'Player not found'});
      } else {
        next(err);
      }
    }
  },

  addUserGameIdByToken: async (req, res, next) => {
    try {
      const { gameid, access_token } = req.body;
      await PlayerService.tokenValidate(access_token);
      const tokenDecode = await PlayerService.getIdByToken(access_token);
      const player = await PlayerService.addPlayerToGame(tokenDecode, {gameid});
      res.status(200).json({ player: player.nameplayer,game_id: player.gameid ,message: "User joined the game successfully" });
    } catch (err) {
      if (err.message === 'User logged out') {
        res.status(401).json({ error: 'User logged out'});
      } else {
        next(err);
      }
    }
  },

  playerLeaveGame: async (req, res, next) => {
    try {
      const { gameid, access_token } = req.body;
      await PlayerService.tokenValidate(access_token);
      const tokenDecode = await PlayerService.getIdByToken(access_token);
      const player = await PlayerService.leavePlayerToGame(tokenDecode, {gameid: null});
      res.status(200).json({ player: player.nameplayer,game_id: player.gameid ,message: "User left the game successfully" });
    } catch (err) {
      if (err.message === 'User logged out') {
        res.status(401).json({ error: 'User logged out'});
      } else {
        next(err);
      }
    }
  },

  updatePlayerPartial: async (req, res, next) => {
    try {
      const player = await PlayerService.updatePlayerPartial(req.params.id, req.body);
      res.status(200).json(player);
    } catch (err) {
      next(err);
    }
  },

  deletePlayer: async (req, res, next) => {
    try {
      await PlayerService.deletePlayer(req.params.id);
      res.status(204).end();
    } catch (err) {
      if (err.message === 'Player not found') {
        res.status(401).json({ error: 'Player not found'});
      } else {
        next(err);
      }
      next(err);
    }
  },

};

module.exports = PlayerController;
