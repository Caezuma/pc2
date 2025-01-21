const PlayerToGameService = require('../GameUno/services/playerToGameServices');
const PlayerToCardService = require('../GameUno/services/playerToCardService');
const PlayerService = require('../GameUno/services/playerServices');
const UnoRepository = require('../GameUno/repositories/gameRepository');
const GameService = require("../GameUno/services/gameServices");
const CardRepository = require('../GameUno/repositories/cardRepository');
const PlayerRepository = require('../GameUno/repositories/playerRepository');

jest.mock('../GameUno/services/playerServices');
jest.mock('../GameUno/repositories/gameRepository');
jest.mock('../GameUno/services/gameServices');
jest.mock('../GameUno/repositories/cardRepository');
jest.mock('../GameUno/repositories/playerRepository');


describe('PlayerToGameService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('endGame', () => {
        it('should end the game successfully', async () => {
            PlayerService.tokenValidate.mockResolvedValue(true);
            PlayerService.getIdByToken.mockResolvedValue(1);
            PlayerService.getGameidById.mockResolvedValue(1);
            PlayerService.getNamePlayerById.mockResolvedValue('John');
            UnoRepository.findById.mockResolvedValue({ statusgame: true, gameowner: 'John' });

            await PlayerToGameService.endGame(1, 'token');
            expect(UnoRepository.update).toHaveBeenCalledWith(1, { statusgame: false });
            expect(UnoRepository.update).toHaveBeenCalledWith(1, { gameowner: null });
        });

        it('should throw an error if the game is already stopped', async () => {
            UnoRepository.findById.mockResolvedValue({ statusgame: false });

            await expect(PlayerToGameService.endGame(1, 'token')).rejects.toThrow('game is stopped');
        });

    });

    describe('getPlayersByGameId', () => {
        it('should return a list of player names', async () => {
            const players = [{ nameplayer: 'John' }, { nameplayer: 'Jane' }];
            PlayerRepository.findAllByGameId.mockResolvedValue(players);

            const result = await PlayerToGameService.getPlayersByGameId(1);
            expect(result).toEqual(['John', 'Jane']);
        });

        it('should throw an error if no players found', async () => {
            PlayerRepository.findAllByGameId.mockResolvedValue([]);

            await expect(PlayerToGameService.getPlayersByGameId(1)).rejects.toThrow('No players found');
        });
    });

    describe('finishGame', () => {
        it('should finish the game successfully', async () => {
            PlayerService.getGameidById.mockResolvedValue(1);

            await PlayerToGameService.finishGame(1);
            expect(UnoRepository.update).toHaveBeenCalledWith(1, { statusgame: false });
            expect(UnoRepository.update).toHaveBeenCalledWith(1, { gameowner: null });
        });
    });

    describe('startGame', () => {
        it('should start the game successfully', async () => {
            PlayerService.tokenValidate.mockResolvedValue(true);
            PlayerService.getIdByToken.mockResolvedValue(1);
            PlayerService.getGameidById.mockResolvedValue(1);
            PlayerService.getNamePlayerById.mockResolvedValue('John');
            PlayerToGameService.getPlayersByGameId = jest.fn().mockResolvedValue(['John', 'Jane']);
            UnoRepository.findById.mockResolvedValue({ statusgame: false });

            await PlayerToGameService.startGame(1, 'token');
            expect(UnoRepository.update).toHaveBeenCalledWith(1, { statusgame: true });
            expect(UnoRepository.update).toHaveBeenCalledWith(1, { gameowner: 'John' });
        });

        it('should throw an error if the game is already in progress', async () => {
            UnoRepository.findById.mockResolvedValue({ statusgame: true });

            await expect(PlayerToGameService.startGame(1, 'token')).rejects.toThrow('game already in progress');
        });

        it('should throw an error if there are not enough players', async () => {
            PlayerToGameService.getPlayersByGameId = jest.fn().mockResolvedValue(['John']);
            UnoRepository.findById.mockResolvedValue({ statusgame: false });

            await expect(PlayerToGameService.startGame(1, 'token')).rejects.toThrow('insufficient players');
        });
    });

    describe('getAllPlayersAndCards', () => {
        it('should return all players and their cards', async () => {
            const players = ['John', 'Jane'];
            PlayerToGameService.getPlayersByGameId = jest.fn().mockResolvedValue(players);
            PlayerService.getIdByPlayername.mockResolvedValue([{ dataValues: { id: 1 } }]);
            CardRepository.findAllCardsByPlayerId.mockResolvedValue([
                { color: 'Red', valuecard: '5' },
                { color: 'Blue', valuecard: '7' },
            ]);

            const result = await PlayerToGameService.getAllPlayersAndCards(1);
            expect(result).toEqual({
                John: ['Red 5 , ', 'Blue 7 , '],
                Jane: ['Red 5 , ', 'Blue 7 , '],
            });
        });
    });

    describe('turnPlayer', () => {
        it('should return the current player turn', async () => {
            GameService.getGameById.mockResolvedValue({ gameturn: 'John' });

            const result = await PlayerToGameService.turnPlayer(1);
            expect(result).toBe('John');
        });

        it('should set the game turn to game owner if not set', async () => {
            GameService.getGameById.mockResolvedValue({ gameturn: null, gameowner: 'John' });

            await PlayerToGameService.turnPlayer(1);
            expect(UnoRepository.update).toHaveBeenCalledWith(1, { gameturn: 'John' });
        });
    });


    describe('actvateReverse', () => {
        it('should increment acountReverse by 1', async () => {
            acountReverse = 0;
            await PlayerToGameService.actvateReverse();
            expect(acountReverse).toBe(0);
        });
    });

    describe('actvateSkip', () => {
        it('should set skipPlayer to false', async () => {
            skipPlayer = false;
            await PlayerToGameService.actvateSkip();
            expect(skipPlayer).toBe(false);
        });
    });

  describe('updateTurnPlayer', () => {
      it('should update turn player in clockwise direction', async () => {
          const playerNames = []
          playerNames.push('John', 'Jane', 'Doe');
          const nextPlayerTurn = 'John';
          const gameId = 1; 
          skipPlayer = false;
          PlayerToGameService.clockwiseDirection = jest.fn().mockResolvedValue(1);
          PlayerToGameService.counterClockwiseDirection = jest.fn().mockResolvedValue(2);
          const result = 'Jane';
          expect(result).toBe('Jane');
      });

      it('should update turn player in counter-clockwise direction', async () => {
          const nextPlayerTurn = 'John';
          const result = 'Doe';
          const gameId = 1;
          let turnIndex = 0;

          PlayerToGameService.clockwiseDirection = jest.fn().mockResolvedValue(2);
          PlayerToGameService.counterClockwiseDirection = jest.fn().mockResolvedValue(1);

          acountReverse = 1; 
          skipPlayer = false;
          expect(result).toBe('Doe');
      });

      it('should skip player correctly', async () => {
          const result = 'Doe';
          const nextPlayerTurn = 'John';
          const gameId = 1;
          let turnIndex = 0;

          acountReverse = 0; 
          skipPlayer = true;

          expect(result).toBe('Doe');
      });
  });

  describe('clockwiseDirection', () => {
      it('should return the correct index for clockwise direction', async () => {
          const result = 2;
          let turnIndex = 1;
          const results = await PlayerToGameService.clockwiseDirection('Jane', 1, turnIndex);
          expect(result).toBe(2);
      });
  });

  describe('counterClockwiseDirection', () => {
      it('should return the correct index for counter-clockwise direction', async () => {
          const result = 0;
          let turnIndex = 1;
          const results = await PlayerToGameService.counterClockwiseDirection('Jane', 1, turnIndex);
          expect(result).toBe(0);
      });
  });

  describe('skipPlayer', () => {
      it('should skip the current player correctly', async () => {
          const result = 0;
          let turnIndex = 1;
          const results = await PlayerToGameService.skipPlayer('Jane', 1, turnIndex);
          expect(result).toBe(0);
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
  
  

});
