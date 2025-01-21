const CardController = require('../GameUno/controllers/cardControllers');
const CardService = require('../GameUno/services/cardServices');
const UnoGameService = require('../GameUno/services/gameServices');
const PlayerService = require('../GameUno/services/playerServices');
const PlayerToCardService = require('../GameUno/services/playerToCardService');
const PlayerToGameService = require('../GameUno/services/playerToGameServices');

jest.mock('../GameUno/services/cardServices');
jest.mock('../GameUno/services/gameServices');
jest.mock('../GameUno/services/playerServices');
jest.mock('../GameUno/services/playerToCardService');
jest.mock('../GameUno/services/playerToGameServices');

describe('CardController', () => {
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

  describe('createCard', () => {
    it('should create a card and return status 201', async () => {
      const cardData = { id: 1, name: 'Card 1' };
      mockReq.body = { gameId: 1, ...cardData };
      UnoGameService.checkGameExists.mockResolvedValue();
      CardService.createCard.mockResolvedValue(cardData);

      await CardController.createCard(mockReq, mockRes, mockNext);

      expect(UnoGameService.checkGameExists).toHaveBeenCalledWith(1);
      expect(CardService.createCard).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(cardData);
    });

    it('should handle "Game not found" error and return status 401', async () => {
      mockReq.body = { gameId: 1 };
      UnoGameService.checkGameExists.mockRejectedValue(new Error('Game not found'));

      await CardController.createCard(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Game not found' });
    });

    it('should pass other errors to next middleware', async () => {
      mockReq.body = { gameId: 1 };
      UnoGameService.checkGameExists.mockRejectedValue(new Error('Some other error'));

      await CardController.createCard(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Some other error'));
    });
  });

  describe('getCardById', () => {
    it('should return a card and status 200', async () => {
      const card = { id: 1, name: 'Card 1' };
      mockReq.params.id = 1;
      CardService.getCardById.mockResolvedValue(card);

      await CardController.getCardById(mockReq, mockRes, mockNext);

      expect(CardService.getCardById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(card);
    });

    it('should handle "Card not found" error and return status 401', async () => {
      mockReq.params.id = 1;
      CardService.getCardById.mockRejectedValue(new Error('Card not found'));

      await CardController.getCardById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Card not found' });
    });

    it('should pass other errors to next middleware', async () => {
      mockReq.params.id = 1;
      CardService.getCardById.mockRejectedValue(new Error('Some other error'));

      await CardController.getCardById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Some other error'));
    });
  });

  describe('getAllCards', () => {
    it('should return all cards and status 200', async () => {
      const cards = [{ id: 1, name: 'Card 1' }];
      CardService.getAllCards.mockResolvedValue(cards);

      await CardController.getAllCards(mockReq, mockRes, mockNext);

      expect(CardService.getAllCards).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(cards);
    });

    it('should handle "No cards available" error and return status 401', async () => {
      CardService.getAllCards.mockRejectedValue(new Error('No cards available for the specified game'));

      await CardController.getAllCards(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No cards available for the specified game' });
    });

    it('should pass other errors to next middleware', async () => {
      CardService.getAllCards.mockRejectedValue(new Error('Some other error'));

      await CardController.getAllCards(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Some other error'));
    });
  });

  describe('distributeCards', () => {
    it('should distribute cards and return status 200', async () => {
      const cards = [{ id: 1, name: 'Card 1' }];
      mockReq.body = { gameid: 1, numberOfCards: 2 };
      PlayerToCardService.randomCards.mockResolvedValue(cards);

      await CardController.distributeCards(mockReq, mockRes, mockNext);

      expect(PlayerToCardService.randomCards).toHaveBeenCalledWith(1, 2);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(cards);
    });

    it('should handle "No players found" error and return status 401', async () => {
      mockReq.body = { gameid: 1, numberOfCards: 2 };
      PlayerToCardService.randomCards.mockRejectedValue(new Error('No players found for the specified game'));

      await CardController.distributeCards(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No players found for the specified game' });
    });

    it('should handle "No cards available" error and return status 401', async () => {
      mockReq.body = { gameid: 1, numberOfCards: 2 };
      PlayerToCardService.randomCards.mockRejectedValue(new Error('No cards available for the specified game'));

      await CardController.distributeCards(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No cards available for the specified game' });
    });

    it('should pass other errors to next middleware', async () => {
      mockReq.body = { gameid: 1, numberOfCards: 2 };
      PlayerToCardService.randomCards.mockRejectedValue(new Error('Some other error'));

      await CardController.distributeCards(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Some other error'));
    });
  });

  describe('getAllCardsValues', () => {
    it('should return all cards for a game and status 200', async () => {
      const cards = [{ id: 1, name: 'Card 1' }];
      mockReq.params.id = 1;
      CardService.getCardsByGameId.mockResolvedValue(cards);

      await CardController.getAllCardsValues(mockReq, mockRes, mockNext);

      expect(CardService.getCardsByGameId).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(cards);
    });

    it('should handle "Card not found" error and return status 401', async () => {
      mockReq.params.id = 1;
      CardService.getCardsByGameId.mockRejectedValue(new Error('Card not found'));

      await CardController.getAllCardsValues(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Card not found' });
    });

    it('should pass other errors to next middleware', async () => {
      mockReq.params.id = 1;
      CardService.getCardsByGameId.mockRejectedValue(new Error('Some other error'));

      await CardController.getAllCardsValues(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Some other error'));
    });
  });

  describe('getAllPlayerCards', () => {
    it('should return all cards for a player and status 200', async () => {
      const playerName = 'Player1';
      const playerData = [{ dataValues: { id: 1 } }];
      const cards = [{ id: 1, name: 'Card 1' }];
      mockReq.body = { player: playerName };
      PlayerService.getIdByPlayername.mockResolvedValue(playerData);
      CardService.getCardsByPlayerId.mockResolvedValue(cards);

      await CardController.getAllPlayerCards(mockReq, mockRes, mockNext);

      expect(PlayerService.getIdByPlayername).toHaveBeenCalledWith(playerName);
      expect(CardService.getCardsByPlayerId).toHaveBeenCalledWith(1, playerName);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ player: playerName, cards: cards });
    });

    it('should pass errors to next middleware', async () => {
      mockReq.body = { player: 'Player1' };
      PlayerService.getIdByPlayername.mockRejectedValue(new Error('Some error'));

      await CardController.getAllPlayerCards(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Some error'));
    });
  });

  describe('cardPlayer', () => {
    
    it('should handle errors and return appropriate status', async () => {
      mockReq.body = { player: 'Player1', cardPlayer: 'Card1' };
      PlayerService.getIdByPlayername.mockRejectedValue(new Error('No players found'));

      await CardController.cardPlayer(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No players found' });
    });
  });

  describe('buyCard', () => {
    it('should handle errors and return appropriate status', async () => {
      mockReq.body = { player: 'Player1' };
      PlayerToCardService.buyCardOnTopDeck.mockRejectedValue(new Error('No players found'));

      await CardController.buyCard(mockReq, mockRes, mockNext);


    });
  });

  describe('challengeUno', () => {
    it('should process a UNO challenge and return status 200', async () => {
      const playerName = 'Player1';
      mockReq.body = { player: playerName };
      PlayerService.getIdByPlayername.mockResolvedValue([{ dataValues: { id: 1 } }]);
      PlayerToCardService.playerChallenge.mockResolvedValue();

      await CardController.challengeUno(mockReq, mockRes, mockNext);

      expect(PlayerService.getIdByPlayername).toHaveBeenCalledWith(playerName);
      expect(PlayerToCardService.playerChallenge).toHaveBeenCalledWith(1, 2);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: `Challenge successful. ${playerName} forgot to say UNO and draws 2 cards.` });
    });

    it('should handle errors and return appropriate status', async () => {
      mockReq.body = { player: 'Player1' };
      PlayerToCardService.playerChallenge.mockRejectedValue(new Error('There are not enough cards in the deck'));

      await CardController.challengeUno(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'There are not enough cards in the deck' });
    });
  });

  describe('sayUno', () => {
    it('should process a UNO call and return status 200', async () => {
      const playerName = 'Player1';
      mockReq.body = { player: playerName };
      PlayerService.getIdByPlayername.mockResolvedValue([{ dataValues: { id: 1 } }]);
      PlayerToCardService.playerSayUno.mockResolvedValue();

      await CardController.sayUno(mockReq, mockRes, mockNext);

      expect(PlayerService.getIdByPlayername).toHaveBeenCalledWith(playerName);
      expect(PlayerToCardService.playerSayUno).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: `${playerName} said UNO successfully.` });
    });

    it('should handle errors and return appropriate status', async () => {
      mockReq.body = { player: 'Player1' };
      PlayerToCardService.playerSayUno.mockRejectedValue(new Error('You have more than one card'));

      await CardController.sayUno(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'You have more than one card' });
    });
  });

  describe('updateCard', () => {
    it('should update a card and return status 200', async () => {
      const updatedCard = { id: 1, name: 'Updated Card' };
      mockReq.params.id = 1;
      mockReq.body = { name: 'Updated Card' };
      CardService.updateCard.mockResolvedValue(updatedCard);

      await CardController.updateCard(mockReq, mockRes, mockNext);

      expect(CardService.updateCard).toHaveBeenCalledWith(1, mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedCard);
    });

    it('should pass errors to next middleware', async () => {
      mockReq.params.id = 1;
      mockReq.body = { name: 'Updated Card' };
      CardService.updateCard.mockRejectedValue(new Error('Some error'));

      await CardController.updateCard(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Some error'));
    });
  });

  describe('deleteCard', () => {
    it('should delete a card and return status 204', async () => {
      mockReq.params.id = 1;
      CardService.deleteCard.mockResolvedValue();

      await CardController.deleteCard(mockReq, mockRes, mockNext);

      expect(CardService.deleteCard).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.end).toHaveBeenCalled();
    });

    it('should pass errors to next middleware', async () => {
      mockReq.params.id = 1;
      CardService.deleteCard.mockRejectedValue(new Error('Some error'));

      await CardController.deleteCard(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Some error'));
    });
  });

  describe('updateCardPartial', () => {
    it('should partially update a card and return status 200', async () => {
      const partialUpdate = { name: 'Partially Updated Card' };
      const updatedCard = { id: 1, ...partialUpdate };
      mockReq.params.id = 1;
      mockReq.body = partialUpdate;
      CardService.updateCardPartial.mockResolvedValue(updatedCard);

      await CardController.updateCardPartial(mockReq, mockRes, mockNext);

      expect(CardService.updateCardPartial).toHaveBeenCalledWith(1, partialUpdate);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedCard);
    });

    it('should pass errors to next middleware', async () => {
      mockReq.params.id = 1;
      mockReq.body = { name: 'Partially Updated Card' };
      CardService.updateCardPartial.mockRejectedValue(new Error('Some error'));

      await CardController.updateCardPartial(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Some error'));
    });
  });

});
