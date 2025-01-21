const CardRepository = require('../GameUno/repositories/cardRepository');
const Card = require('../GameUno/models/cardModels');

jest.mock('../GameUno/models/cardModels');

describe('CardRepository', () => {
  let mockCardInstance;

  beforeEach(() => {
    mockCardInstance = {
      update: jest.fn(),
      destroy: jest.fn()
    };

    Card.create.mockResolvedValue(mockCardInstance);
    Card.findByPk.mockResolvedValue(mockCardInstance);
    Card.findAll.mockResolvedValue([mockCardInstance]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new card', async () => {
      const cardData = { value: 'Ace' };
      Card.create.mockResolvedValue(cardData);

      const result = await CardRepository.create(cardData);

      expect(Card.create).toHaveBeenCalledWith(cardData);
      expect(result).toEqual(cardData);
    });

    it('should handle errors', async () => {
      const error = new Error('Creation error');
      Card.create.mockRejectedValue(error);

      await expect(CardRepository.create({})).rejects.toThrow('Creation error');
    });
  });

  describe('findById', () => {
    it('should find a card by id', async () => {
      const cardId = 1;
      const cardData = { id: cardId, value: 'Ace' };
      Card.findByPk.mockResolvedValue(cardData);

      const result = await CardRepository.findById(cardId);

      expect(Card.findByPk).toHaveBeenCalledWith(cardId);
      expect(result).toEqual(cardData);
    });

    it('should return null if card is not found', async () => {
      const cardId = 1;
      Card.findByPk.mockResolvedValue(null);

      const result = await CardRepository.findById(cardId);

      expect(Card.findByPk).toHaveBeenCalledWith(cardId);
      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      const error = new Error('Find error');
      Card.findByPk.mockRejectedValue(error);

      await expect(CardRepository.findById(1)).rejects.toThrow('Find error');
    });
  });

  describe('findAll', () => {
    it('should return all cards', async () => {
      const cards = [{ id: 1, value: 'Ace' }];
      Card.findAll.mockResolvedValue(cards);

      const result = await CardRepository.findAll();

      expect(Card.findAll).toHaveBeenCalled();
      expect(result).toEqual(cards);
    });

    it('should handle errors', async () => {
      const error = new Error('Find all error');
      Card.findAll.mockRejectedValue(error);

      await expect(CardRepository.findAll()).rejects.toThrow('Find all error');
    });
  });

  describe('findAllByGameId', () => {
    it('should return all cards for a given game id', async () => {
      const gameId = 1;
      const cards = [{ value: 'Ace' }];
      Card.findAll.mockResolvedValue(cards);

      const result = await CardRepository.findAllByGameId(gameId);

      expect(Card.findAll).toHaveBeenCalledWith({ where: { gameId: gameId }, attributes: ['valuecard'] });
      expect(result).toEqual(cards);
    });

    it('should handle errors', async () => {
      const error = new Error('Find all by game id error');
      Card.findAll.mockRejectedValue(error);

      await expect(CardRepository.findAllByGameId(1)).rejects.toThrow('Find all by game id error');
    });
  });

  describe('update', () => {
    it('should update an existing card', async () => {
      const cardId = 1;
      const cardData = { value: 'King' };
      const updatedCard = { id: cardId, value: 'King' };
      Card.findByPk.mockResolvedValue({ ...mockCardInstance, ...cardData });
      mockCardInstance.update.mockResolvedValue(updatedCard);

      const result = await CardRepository.update(cardId, cardData);

      expect(Card.findByPk).toHaveBeenCalledWith(cardId);
      expect(mockCardInstance.update).toHaveBeenCalledWith(cardData);
      expect(result).toEqual(updatedCard);
    });

    it('should throw an error if card is not found', async () => {
      const cardId = 1;
      const cardData = { value: 'King' };
      Card.findByPk.mockResolvedValue(null);

      await expect(CardRepository.update(cardId, cardData)).rejects.toThrow('Card not found');
    });

    it('should handle errors', async () => {
      const error = new Error('Update error');
      Card.findByPk.mockResolvedValue(mockCardInstance);
      mockCardInstance.update.mockRejectedValue(error);

      await expect(CardRepository.update(1, {})).rejects.toThrow('Update error');
    });
  });

  describe('delete', () => {
    it('should delete a card', async () => {
      const cardId = 1;
      Card.findByPk.mockResolvedValue(mockCardInstance);
      mockCardInstance.destroy.mockResolvedValue();

      await CardRepository.delete(cardId);

      expect(Card.findByPk).toHaveBeenCalledWith(cardId);
      expect(mockCardInstance.destroy).toHaveBeenCalled();
    });

    it('should throw an error if card is not found', async () => {
      const cardId = 1;
      Card.findByPk.mockResolvedValue(null);

      await expect(CardRepository.delete(cardId)).rejects.toThrow('Card not found');
    });

    it('should handle errors', async () => {
      const error = new Error('Delete error');
      Card.findByPk.mockResolvedValue(mockCardInstance);
      mockCardInstance.destroy.mockRejectedValue(error);

      await expect(CardRepository.delete(1)).rejects.toThrow('Delete error');
    });
  });
});
