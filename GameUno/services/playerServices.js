const PlayerRepository = require('../repositories/playerRepository');

const jwt = require("jsonwebtoken")
const blacklist = new Set();
const playerNames = [];
const turnPlayerNow = [];


const SECRET_KEY = "senha";

const PlayerServices = {
  createPlayer: async (playerData, gameId) => {
    const { email } = playerData;
    const existingPlayer = await PlayerRepository.findByEmail(email);
    if (existingPlayer) {
        throw new Error("User already exists");
    }
    return await PlayerRepository.create(playerData);
  },


  loginPlayer: async (email, password) => {
    const player = await PlayerRepository.findByEmail(email);

    if (!player) {
      throw new Error('Invalid credentials');
    }

    if (player.userpassword !== password) {
      throw new Error('Invalid credentials');
    }

    return jwt.sign({
      id: player.id,
      nameplayer: player.nameplayer,
      email: player.email,
      gameid: player.gameid
    }, SECRET_KEY, { expiresIn: "2h" });
  },

  logoutPlayer: async (token) => {
    if (!blacklist.has(token)) {
      blacklist.add(token);
      return { message: 'User logged out successfully' };
    } else {
      throw new Error('User already logged out');
    }
  },

  getPlayerByToken: async (token) => {
    return jwt.decode(token, SECRET_KEY);
  },
 
  getIdByToken: async (token) => {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    return decodedToken.id;
  },

  getGameidById: async (id) => {
    const player = await PlayerRepository.findById(id);
    return player.gameid
  },
  
  getNamePlayerById: async (id) => {
    const player = await PlayerRepository.findById(id);
    return player.nameplayer
  },

  getPlayerById: async (playerId) => {
    return await PlayerRepository.findById(playerId);
  },

  getAllPlayers: async () => {
    return await PlayerRepository.findAll();
  },

  getGameidByEmail: async () => {
    return await PlayerRepository.findAll();
  },

  updatePlayer: async (playerId, playerData) => {
    return await PlayerRepository.update(playerId, playerData);
  },

  getIdByPlayername: async (namePlayer) => {
    return await PlayerRepository.findPlayersIdByNameplayer(namePlayer);
  },

  updatePlayerPartial: async (playerId, updates) => {
    return await PlayerRepository.update(playerId, updates);
  },

  addPlayerToGame: async (playerId, updates) => {
    return await PlayerRepository.update(playerId, updates);
  },

  leavePlayerToGame: async (playerId, updates) => {
    return await PlayerRepository.update(playerId, updates);
  },

  deletePlayer: async (playerId) => {
    const deleted = await PlayerRepository.delete(playerId)
    if(!deleted){
      throw new Error('Player not found');
    }
    return deleted;
  },

  tokenValidate: async (token) => {
    if(blacklist.has(token)){
      throw new Error('User logged out');
    }
  },

};

module.exports = PlayerServices;
