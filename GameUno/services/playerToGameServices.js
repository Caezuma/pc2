const UnoRepository = require('../repositories/gameRepository');
const PlayerService = require('../services/playerServices');
const GameService = require("../services/gameServices");
const CardRepository = require('../repositories/cardRepository');
const PlayerRepository = require('../repositories/playerRepository');
const { reverse } = require('fp-ts/lib/Bounded');

const playerNames = [];
let acountReverse = 0;
let skipPlayer = false;


const PlayerToGameService = {

    actvateReverse: async () => {
        acountReverse++;
    },

    actvateSkip: async () => {
        skipPlayer = true;
    },

    endGame: async (gameId, token) => {
        await PlayerService.tokenValidate(token);

        const tokenDecodeId = await PlayerService.getIdByToken(token);
        const playerGameId = await PlayerService.getGameidById(tokenDecodeId);
        const namePlayer = await PlayerService.getNamePlayerById(tokenDecodeId);

        const game = await UnoRepository.findById(gameId);

        if(game.statusgame === false){
        throw new Error('game is stopped');
        }else if(playerGameId != gameId){
        throw new Error('player not being in the game');
        }else if (namePlayer != game.gameowner){
        throw new Error('player does not own the game');
        }else{
        await UnoRepository.update(gameId, { statusgame: false });
        await UnoRepository.update(gameId, { gameowner: null});
        } 
    },
    
    getPlayersByGameId: async (gameId) => {
        playerNames.length = 0;
        const players = await PlayerRepository.findAllByGameId(gameId);
        const names = players.map(player => player.nameplayer);
        playerNames.push(...names);
        if (!names.length){
          throw new Error('No players found');
        }
        return names;
    },

    finishGame: async (playerId) => {
        const gameId = await PlayerService.getGameidById(playerId);
        await UnoRepository.update(gameId, { statusgame: false });
        await UnoRepository.update(gameId, { gameowner: null});
    },

    startGame: async (gameId, token) => {
        await PlayerService.tokenValidate(token);

        const tokenDecodeId = await PlayerService.getIdByToken(token);
        const playerGameId = await PlayerService.getGameidById(tokenDecodeId);
        const namePlayer = await PlayerService.getNamePlayerById(tokenDecodeId);
        const playerCount = await PlayerToGameService.getPlayersByGameId(gameId);

        const game = await UnoRepository.findById(gameId);

        if(game.statusgame == true){
        throw new Error('game already in progress');
        }else if(playerGameId != gameId){
        throw new Error('player not being in the game');
        }else if (playerCount.length < 2){
        throw new Error('insufficient players');
        }else{
        await UnoRepository.update(gameId, { statusgame: true });
        await UnoRepository.update(gameId, { gameowner: namePlayer});
        } 
    },

    getAllPlayersAndCards: async (gameId) => {
        const allPlayers = await PlayerToGameService.getPlayersByGameId(gameId);
        
        const playersWithCards = {};

        for (const player of allPlayers) {
            const playerLoopIdData = await PlayerService.getIdByPlayername(player);
            const playerCleanId = playerLoopIdData[0].dataValues.id;
            const playerCards = await CardRepository.findAllCardsByPlayerId(playerCleanId);
            const formattedCards = playerCards.map(card => `${card.color} ${card.valuecard} , `);
            playersWithCards[player] = formattedCards;
        }

        return playersWithCards;
    },

    turnPlayer: async (gameId) => {
        const gameTurn = await GameService.getGameById(gameId)
        if (gameTurn.gameturn == null) { 
            await UnoRepository.update(gameId, { gameturn: gameTurn.gameowner});
        }
        const currentPlayer = gameTurn.gameturn;
        return currentPlayer;
    },

    updateTurnPlayer: async (nextPlayerTurn, gameId) => {
        let turnIndex = playerNames.indexOf(nextPlayerTurn);
        if (acountReverse % 2 === 0) {
            turnIndex = await PlayerToGameService.clockwiseDirection(nextPlayerTurn, gameId, turnIndex);
            if(skipPlayer === true){
                turnIndex++;
                skipPlayer = false;
            }
        }else{
            turnIndex = await PlayerToGameService.counterClockwiseDirection(nextPlayerTurn, gameId, turnIndex);
            if(skipPlayer === true){
                turnIndex--;
                skipPlayer = false;
            }
        }
        const currentPlayer = playerNames[turnIndex];
        await UnoRepository.update(gameId, { gameturn: currentPlayer});
        return currentPlayer;
    },

    clockwiseDirection: async (nextPlayerTurn, gameId, turnIndex) => {
        if (turnIndex === -1) {
            turnIndex = 0; 
        } else {
            turnIndex = (turnIndex + 1) % playerNames.length; 
        }
        return turnIndex
    },

    counterClockwiseDirection: async (nextPlayerTurn, gameId, turnIndex) => {
        if (turnIndex === -1) {
            turnIndex = playerNames.length - 1; 
        } else {
            turnIndex = (turnIndex - 1 + playerNames.length) % playerNames.length;
        }
        return turnIndex
    },

    skipPlayer: async (nextPlayerTurn, gameId, turnIndex) => {
        if (turnIndex === -1) {
            turnIndex = playerNames.length - 2; 
        } else {
            turnIndex = (turnIndex - 1 + playerNames.length) % playerNames.length;
        }
        return turnIndex
    }
};

module.exports = PlayerToGameService;
