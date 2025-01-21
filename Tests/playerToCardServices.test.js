const PlayerToCardService = require('../GameUno/services/playerToCardService');
const CardRepository = require('../GameUno/repositories/cardRepository');
const PlayerService = require('../GameUno/services/playerServices');
const GameService = require('../GameUno/services/gameServices');
const CardService = require('../GameUno/services/cardServices');
const PlayerToGameService = require('../GameUno/services/playerToGameServices');

jest.mock('../GameUno/repositories/cardRepository');
jest.mock('../GameUno/services/playerServices');
jest.mock('../GameUno/services/gameServices');
jest.mock('../GameUno/services/cardServices');
jest.mock('../GameUno/services/playerToGameServices');



describe('PlayerToCardService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('playerPlaysCard', () => {
    it('should handle a player playing a card correctly', async () => {
      const playerId = 1;
      const cardPlayer = 'red 5';
      const nextPlayerTurn = 2;
      const gameId = 1;
      const playerTurnPlay = 1;
      const result = {};
      const cards = [{ id: 1, color: 'red', valuecard: '5', player_id: playerId }];
      const card = { id: 1, color: 'red', valuecard: '5', player_id: playerId };
      const cardId = { id: 1 };

      PlayerToGameService.turnPlayer.mockResolvedValue(playerTurnPlay);
      CardRepository.findAllCardsByPlayerId.mockResolvedValue(cards);
      CardRepository.findByColorAndValue.mockResolvedValue(cardId);
      CardRepository.findById.mockResolvedValue(card);
      GameService.updateGame.mockResolvedValue({});
      PlayerToGameService.updateTurnPlayer.mockResolvedValue({});
      PlayerToCardService.playerWonGame = jest.fn().mockResolvedValue("win");
      PlayerToCardService.sayUnoRefresh = jest.fn().mockResolvedValue();

      expect(result).toEqual({});
    });
  });

  describe('getGameHistory', () => {
    it('should return game history', async () => {
      const history = ['Player2 played red 5'];
      PlayerToCardService.getGameHistory = jest.fn().mockResolvedValue(history);

      const result = await PlayerToCardService.getGameHistory();
      expect(result).toEqual(history);
    });
  });

  describe('playerSayUno', () => {
    it('should handle player saying Uno correctly if they have one card', async () => {
      const playerId = 1;
      const cards = [{ id: 1, color: 'red', valuecard: '5' }];

      CardRepository.findAllCardsByPlayerId.mockResolvedValue(cards);

      await PlayerToCardService.playerSayUno(playerId);

      expect(CardRepository.findAllCardsByPlayerId).toHaveBeenCalledWith(playerId);

    });

    it('should throw an error if player has more than one card', async () => {
      const playerId = 1;
      const cards = [
        { id: 1, color: 'red', valuecard: '5' },
        { id: 2, color: 'blue', valuecard: '3' }
      ];

      CardRepository.findAllCardsByPlayerId.mockResolvedValue(cards);

      await expect(PlayerToCardService.playerSayUno(playerId)).rejects.toThrow('You have more than one letter');
    });
  });



  describe('validateCardRules', () => {
    it('should validate card rules correctly', async () => {
      const color = 'red';
      const value = '5';
      const gameId = 1;
      const lastCard = { topcard: 'red 5' };

      GameService.getGameById.mockResolvedValue(lastCard);

      await PlayerToCardService.validateCardRules(color, value, gameId);
      expect(GameService.getGameById).toHaveBeenCalledWith(gameId);
    });

    it('should throw an error for invalid card rules', async () => {
      const color = 'green';
      const value = '2';
      const gameId = 1;
      const lastCard = { topcard: 'red 5' };

      GameService.getGameById.mockResolvedValue(lastCard);

      await expect(PlayerToCardService.validateCardRules(color, value, gameId)).rejects.toThrow('wrong card, do you want to buy a card?');
    });
  });
 
  describe('addGameCardToDeck', () => {
    it('should throw an error if there are no cards in the game to add back to the deck', async () => {
      const cardsInGame = [];

      CardRepository.findAllCardsByPlayerId.mockResolvedValue(cardsInGame);

      await expect(PlayerToCardService.addGameCardToDeck())
        .rejects.toThrow('Não há cartas disponíveis no game.');
    });
  });
  
  describe('distributeCards', () => {
    it('should distribute cards correctly', () => {
      const players = ['Player1'];
      const allCards = [
        { id: 1, color: 'red', valuecard: '5' },
      ];
      const numberOfCards = 1;

      const { distribution, cardsData } = PlayerToCardService.distributeCards(players, allCards, numberOfCards);

      expect(distribution).toEqual({
        'Player1': ['red 5'],
      });
    });
  });
});
