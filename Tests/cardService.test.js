const CardService = require('../GameUno/services/cardServices');
const CardRepository = require('../GameUno/repositories/cardRepository');;
const GameService = require('../GameUno/services/gameServices');

jest.mock('../GameUno/repositories/cardRepository');

describe('CardService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCard', () => {
    it('should create a new card', async () => {
      const cardData = { color: 'red', valuecard: '5' };
      const createdCard = { id: 1, ...cardData };
      CardRepository.create.mockResolvedValue(createdCard);

      const result = await CardService.createCard(cardData);

      expect(CardRepository.create).toHaveBeenCalledWith(cardData);
      expect(result).toEqual(createdCard);
    });
  });

  describe('getCardById', () => {
    it('should return a card by its ID', async () => {
      const cardId = 1;
      const card = { id: cardId, color: 'blue', valuecard: '7' };
      CardRepository.findById.mockResolvedValue(card);

      const result = await CardService.getCardById(cardId);

      expect(CardRepository.findById).toHaveBeenCalledWith(cardId);
      expect(result).toEqual(card);
    });

    it('should throw an error if the card is not found', async () => {
      const cardId = 1;
      CardRepository.findById.mockResolvedValue(null);

      await expect(CardService.getCardById(cardId)).rejects.toThrow('Card not found');
    });
  });

  describe('getCardsByPlayerId', () => {
    it('should return all cards for a player by player ID', async () => {
      const playerId = 1;
      const cards = [
        { color: 'yellow', valuecard: '2' },
        { color: 'green', valuecard: '9' }
      ];
      CardRepository.findAllCardsByPlayerId.mockResolvedValue(cards);

      const result = await CardService.getCardsByPlayerId(playerId);

      expect(CardRepository.findAllCardsByPlayerId).toHaveBeenCalledWith(playerId);
      expect(result).toEqual(cards.map(card => `${card.color} ${card.valuecard}`));
    });
  });

  describe('deleteCard', () => {
    it('should delete a card by its ID', async () => {
      const cardId = 1;
      CardRepository.delete.mockResolvedValue(true);

      const result = await CardService.deleteCard(cardId);

      expect(CardRepository.delete).toHaveBeenCalledWith(cardId);
      expect(result).toBe(true);
    });
  });

  describe('updateCardPartial', () => {
    it('should partially update a card', async () => {
      const cardId = 1;
      const updates = { color: 'blue' };
      const updatedCard = { id: cardId, color: 'blue', valuecard: '7' };
      CardRepository.update.mockResolvedValue(updatedCard);

      const result = await CardService.updateCardPartial(cardId, updates);

      expect(CardRepository.update).toHaveBeenCalledWith(cardId, updates);
      expect(result).toEqual(updatedCard);
    });
  });

  describe('getAllCards', () => {
    it('should return all cards for a game by game ID', async () => {
      const gameId = 1;
      const allCards = [{ color: 'red', valuecard: '5' }, { color: 'blue', valuecard: '3' }];
      CardRepository.findAllCardsByGameId.mockResolvedValue(allCards);

      const result = await CardService.getAllCards(gameId);

      expect(CardRepository.findAllCardsByGameId).toHaveBeenCalledWith(gameId);
      expect(result).toEqual(allCards);
    });

    it('should throw an error if no cards are found', async () => {
      const gameId = 1;
      CardRepository.findAllCardsByGameId.mockResolvedValue([]);

      await expect(CardService.getAllCards(gameId)).rejects.toThrow('No cards available for the specified game');
    });
  });

  describe('getCardsByGameId', () => {
    it('should return all cards for a game by game id', async () => {
      const gameId = 1;
      const cards = [{ valuecard: 'blue' }, { valuecard: 'red' }];
      CardRepository.findAllByGameId.mockResolvedValue(cards);

      const result = await CardService.getCardsByGameId(gameId);

      expect(CardRepository.findAllByGameId).toHaveBeenCalledWith(gameId);
      expect(result.map(val => val)).toEqual((cards.map(card => card.valuecard)).map(val => val));
    });

    it('should throw an error if no cards are found', async () => {
      const gameId = 1;
      CardRepository.findAllByGameId.mockResolvedValue([]);

      await expect(CardService.getCardsByGameId(gameId)).rejects.toThrow('Card not found');
    });
  });
});
