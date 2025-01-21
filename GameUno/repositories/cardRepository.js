const Card = require('../models/cardModels');

const CardRepository = {
  create: async (cardData) => {
    return await Card.create(cardData);
  },

  findById: async (cardId) => {
    return await Card.findByPk(cardId);
  },

  findAll: async () => {
    return await Card.findAll();
  },

  findByColorAndValue: async (color, value) => {
    return await Card.findOne({ 
      where: { color: color, valuecard: value }, 
      attributes: ['id'] 
    });
  },

  findAllByGameId: async (gameId) => {
    return await Card.findAll({ where: { gameId: gameId }, attributes: ['valuecard'] });
  },

  findAllCardsByGameId: async (gameid) => {
    return await Card.findAll({ where: { gameId: gameid }});
  },

  findAllCardsByPlayerId: async (playerId) => {
    return await Card.findAll({ where: { player_id: playerId }});
  },

  update: async (cardId, cardData) => {
    let card = await Card.findByPk(cardId);
    if (!card) {
      throw new Error('Card not found');
    }
    return await card.update(cardData);
  },

  delete: async (cardId) => {
    let card = await Card.findByPk(cardId);
    if (!card) {
      throw new Error('Card not found');
    }
    await card.destroy();
  },
};

module.exports = CardRepository;
