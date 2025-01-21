const CardService = require('../services/cardServices');
const PlayerToCardSevice = require('../services/playerToCardService');
const PlayerToGameService = require('../services/playerToGameServices');

const GameService = require('../services/gameServices');
const PlayerService = require('../services/playerServices');

const CardController = {
  createCard: async (req, res, next) => {
    try {
      const { gameId } = req.body;
      await GameService.checkGameExists(gameId);
      const card = await CardService.createCard(req.body);
      res.status(201).json(card);
    } catch (err) {
      if (err.message === 'Game not found') {
        res.status(401).json({ error: 'Game not found'});
      } else {
        next(err);
      }
    }
  },

  getCardById: async (req, res, next) => {
    try {
      const card = await CardService.getCardById(req.params.id);
      res.status(200).json(card);
    } catch (err) {
      if (err.message === 'Card not found') {
        res.status(401).json({ error: 'Card not found'});
      } else {
        next(err);
      }
    }
  },

  getAllCards: async (req, res, next) => {
    try {
      const cards = await CardService.getAllCards();
      res.status(200).json(cards);
    } catch (err) {
      if (err.message === 'No cards available for the specified game') {
        res.status(401).json({ error: 'No cards available for the specified game'});
      } else {
        next(err);
      }
    }
  },
  
  distributeCards: async (req, res, next) => {
    try {
      const { gameid, numberOfCards } = req.body;
      const cards = await PlayerToCardSevice.randomCards(gameid, numberOfCards);
      res.status(200).json(cards);
    } catch (err) {
      if (err.message === 'No players found for the specified game') {
        res.status(401).json({ error: 'No players found for the specified game'});
      } else if (err.message === 'No cards available for the specified game') {
        res.status(401).json({ error: 'No cards available for the specified game'});
      } else {
        next(err);
      }
    }
  },

  getAllCardsValues: async (req, res, next) => {
    try {
      const cards = await CardService.getCardsByGameId(req.params.id);
      res.status(200).json(cards);
    } catch (err) {
      if (err.message === 'Card not found') {
        res.status(401).json({ error: 'Card not found'});
      } else {
        next(err);
      }
    }
  },

  getAllPlayerCards: async (req, res, next) => {
    try {
      const { player} = req.body;
      const playerData = await PlayerService.getIdByPlayername(player);
      const playerId = playerData[0].dataValues.id;
      const cards = await CardService.getCardsByPlayerId(playerId, player)
      res.status(200).json({player: player,cards: cards});
    } catch (err) {
      next(err);
    }
  },


  cardPlayer: async (req, res, next) => {
    try {
      const { player, cardPlayer} = req.body;
      const playerData = await PlayerService.getIdByPlayername(player);
      const playerId = playerData[0].dataValues.id;
      await PlayerToGameService.getPlayersByGameId(req.params.id);
      const nextPlayerTurn = await PlayerToCardSevice.playerPlaysCard(playerId, cardPlayer, player, req.params.id)
      res.status(200).json({message: "Card played successfully.", turnPlayer: nextPlayerTurn});
    } catch (err) {
      if (err.message === 'No players found') {
        res.status(401).json({ error: 'No players found'});
      } else if(err.message === 'wrong card, do you want to buy a card?') {
        res.status(401).json({ error: 'wrong card, do you want to buy a card?'});
      }else if(err.message === 'Its not the players turn') {
        res.status(401).json({ error: 'Its not the players turn'});
      }else if(err.message === 'The player does not have this card.') {
        res.status(401).json({ error: 'The player does not have this card.'});
      }else {
        next(err);
      }
    }
  },

  buyCard: async (req, res, next) => {
    try {
      const { player } = req.body;
      const playerData= await PlayerService.getIdByPlayername(player);
      const playerId = playerData[0].dataValues.id;
      await PlayerToGameService.getPlayersByGameId(req.params.id);
      const {printCards, playerTurnNow} = await PlayerToCardSevice.buyCardOnTopDeck(playerId, 1, player, req.params.id);
      res.status(200).json({message: player + " drew a card from the deck." , cardDraw: printCards, playerTurn: playerTurnNow});
    } catch (err) {
      if (err.message === 'No players found') {
        res.status(401).json({ error: 'No players found'});
      } else if(err.message === 'There are not enough cards in the deck') {
        res.status(401).json({ error: 'There are not enough cards in the deck'});
      }else if(err.message === 'Its not the players turn') {
        res.status(401).json({ error: 'Its not the players turn'});
      }else {
        next(err);
      }
    }
  },

  challengeUno: async (req, res, next) => {
    try {
      const { player } = req.body;
      const playerData= await PlayerService.getIdByPlayername(player);
      const playerId = playerData[0].dataValues.id;
      await PlayerToCardSevice.playerChallenge(playerId, 2);
      res.status(200).json({message: "Challenge successful. " + player + " forgot to say UNO and draws 2 cards."});
    } catch (err) {
      if (err.message === 'he has more than one card') {
        res.status(401).json({ error: 'he has more than one card'});
      } else if(err.message === 'he already said one') {
        res.status(401).json({ error: 'he already said one'});
      }else if(err.message === 'Its not the players turn') {
        res.status(401).json({ error: 'Its not the players turn'});
      }else if (err.message === 'No players found') {
        res.status(401).json({ error: 'No players found'});
      } else if(err.message === 'There are not enough cards in the deck') {
        res.status(401).json({ error: 'There are not enough cards in the deck'});
      }else {
        next(err);
      }
    }
  },

  sayUno: async (req, res, next) => {
    try {
      const { player } = req.body;
      const playerData= await PlayerService.getIdByPlayername(player);
      const playerId = playerData[0].dataValues.id;
      await PlayerToCardSevice.playerSayUno(playerId);
      res.status(200).json({message: player + " said UNO successfully."});
    } catch (err) {
      if (err.message === `You have more than one card`) {
        res.status(401).json({ error: `You have more than one card`});
      } else {
        next(err);
      }
    }
  },

  updateCard: async (req, res, next) => {
    try {
      const card = await CardService.updateCard(req.params.id, req.body);
      res.status(200).json(card);
    } catch (err) {
      next(err);
    }
  },

  deleteCard: async (req, res, next) => {
    try {
      await CardService.deleteCard(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  updateCardPartial: async (req, res, next) => {
    try {
      const card = await CardService.updateCardPartial(req.params.id, req.body);
      res.status(200).json(card);
    } catch (err) {
      next(err);
    }
  }

};

module.exports = CardController;
