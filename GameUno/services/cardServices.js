const CardRepository = require('../repositories/cardRepository');
const PlayerService = require('./playerServices');
const GameService = require('../services/gameServices');

const { id } = require('fp-ts/lib/Refinement');

const decks = [];
const sayUno = ["no"];
const lastCard = ["default default"];
let turnIndex = 0;

const CardService = {
  createCard: async (cardData) => {
    const result = await CardRepository.create(cardData);
    return result;
  },

  getCardById: async (cardId) => {
    const card = await CardRepository.findById(cardId);
    if (!card || cardId == null) {
      throw new Error('Card not found');
    }
    return card;
  },

  getCardsByPlayerId: async (playerId) => {
    const cards = await CardRepository.findAllCardsByPlayerId(playerId);
    const formattedCards = cards.map(card => `${card.color} ${card.valuecard}`);
    return formattedCards; 
  },

  getCardsByGameId: async (gameId) => {
    decks.length = 0;
    const cards = await CardRepository.findAllByGameId(gameId);
    const values = cards.map(card => card.valuecard);
    decks.push(...values);
    if (!values.length) {
      throw new Error('Card not found');
    }
    return values;
  },

  getAllCards: async () => {
    const cards = await CardRepository.findAll();
    return cards;
  },

  updateCard: async (cardId, cardData) => {
    const result = await CardRepository.update(cardId, cardData);
    return Functor.of(result);
  },

  deleteCard: async (cardId) => {
    const result = await CardRepository.delete(cardId);
    return result;
  },

  updateCardPartial: async (cardId, updates) => {
    const result = await CardRepository.update(cardId, updates);
    return result;
  },

  getAllCards: async (gameId) => {
    const allCards = await CardRepository.findAllCardsByGameId(gameId);
    if (!allCards || allCards.length === 0) {
      throw new Error('No cards available for the specified game');
    }
    return allCards;
  },

};

module.exports = CardService;