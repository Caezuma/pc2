const CardRepository = require('../repositories/cardRepository');
const PlayerService = require('./playerServices');
const GameService = require('../services/gameServices');
const CardService = require('../services/cardServices');
const PlayerToGameService = require('../services/playerToGameServices');



const { id } = require('fp-ts/lib/Refinement');


const sayUno = ["no"];
const gameHistory = [];



const PlayerToCardService = {

  playerPlaysCard: async (playerId, cardPlayer, nextPlayerTurn, gameId) => {
    const playerTurnPlay = await PlayerToGameService.turnPlayer(gameId);
    const cards = await CardRepository.findAllCardsByPlayerId(playerId);
    await PlayerToCardService.sayUnoRefresh(cards.length);
    const [color, value] = cardPlayer.split(' ');

    const cardId = await CardRepository.findByColorAndValue(color, value);
    const card = await CardRepository.findById(cardId.id);

    await PlayerToCardService.validateCardRules(color, value, gameId);
    await PlayerToCardService.validatePlayerPlay(playerTurnPlay, nextPlayerTurn,  playerId, card);

    const playerUpdate = await PlayerToGameService.updateTurnPlayer(nextPlayerTurn, gameId);
    await CardRepository.update(cardId.id, {player_id: 0});
    await GameService.updateGame(gameId, {topcard: cardPlayer}); 
    
    await PlayerToCardService.playerWonGame(cards.length);

    gameHistory.push(nextPlayerTurn+ " played " + cardPlayer);
    return playerUpdate;
    
  },

  getGameHistory: async () => {
    return gameHistory;
  },

  playerSayUno: async (playerId) => {
    const cards = await CardRepository.findAllCardsByPlayerId(playerId);
    if (cards.length === 1){
      sayUno.length = 0;
      sayUno.push("yes");
      return;
    }
    throw new Error('You have more than one letter');
  },

  playerChallenge: async (playerId) => {
    const cards = await CardRepository.findAllCardsByPlayerId(playerId);
    if (cards.length === 1 && sayUno[0] == "no"){
      const buyCard = await PlayerToCardService.buyCardOnTopDeck(playerId, 2)
      return buyCard;
    }else if(sayUno[0] == "yes"){
        throw new Error('he already said one');
    }else{
        throw new Error('he has more than one letter');
    }
  },

  buyCardOnTopDeck: async (playerId, numberOfCards, nextPlayerTurn, gameId) => {
    
    const playerTurnPlay = await PlayerToGameService.turnPlayer(gameId);
    let cards = await PlayerToCardService.validateBuyCard(numberOfCards, playerTurnPlay, nextPlayerTurn);
    cards = cards.sort(() => Math.random() - 0.5);
    const selectedCards = cards.slice(0, numberOfCards);
    for (const card of selectedCards) {
      await CardRepository.update(card.dataValues.id, { player_id: playerId });
    }
    const printCards = selectedCards.map(card => 
      card.dataValues.color + " " + card.dataValues.valuecard
    );
    const playerTurnNow = await PlayerToGameService.updateTurnPlayer(nextPlayerTurn, gameId);
    gameHistory.push(nextPlayerTurn+ " drew " + printCards);

    return {printCards , playerTurnNow };
  },

  addGameCardToDeck: async () => {
    const cardsInGame = await CardRepository.findAllCardsByPlayerId(0);
    if (cardsInGame.length === 0) {
      throw new Error('Não há cartas disponíveis no game.');
    }
    const updatePromises = cardsInGame.map(card => 
      CardRepository.update(card.dataValues.id, { player_id: null })
    );
    await Promise.all(updatePromises);
  },
  
  randomCards: async (gameId, numberOfCards) => {
    const players = await PlayerToCardService.getPlayers(gameId);
    const allCards = await CardService.getAllCards(gameId);
    const { distribution, cardsData } = PlayerToCardService.distributeCards(players, allCards, numberOfCards);
    await PlayerToCardService.assignCardsToPlayers(cardsData);
    return distribution;
  },

  getPlayers: async (gameId) => {
    const players = await PlayerToGameService.getPlayersByGameId(gameId);
    if (!players || players.length === 0) {
      throw new Error('No players found for the specified game');
    }
    return players;
  },

  distributeCards: (players, allCards, numberOfCards) => {
    const getRandomCards = (cards, count) => {
      const shuffled = cards.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const distribution = {};
    const cardsData = {};

    players.forEach(player => {
      const playerCards = getRandomCards(allCards, numberOfCards);
      distribution[player] = playerCards.map(card => `${card.color} ${card.valuecard}`);

      cardsData[player] = playerCards.map(card => ({
        id: card.id
      }));
    });

    return { distribution, cardsData };
  },

  assignCardsToPlayers: async (cardsData) => {
    for (const player in cardsData) {
      if (cardsData.hasOwnProperty(player)) {
        const playertst = await PlayerService.getIdByPlayername(player);
        const playerId = playertst[0].dataValues.id;
        for (const card of cardsData[player]) {
            const cardPlayer = await CardRepository.findById(card.id);
            if (cardPlayer.player_id === null){
              await CardRepository.update(card.id, { player_id: playerId });
            }
        }
      }
    }
  },

  playerWonGame: async (cardsAmount) => {
    if(cardsAmount == 1){
        await GameService.finishGame(playerId);
        return "win"
    }
  },

  sayUnoRefresh: async (cardsAmount) => {
    if (cardsAmount >= 2){
        sayUno.length = 0;
        sayUno.push("no"); 
    }
  },

  validateCardRules: async (color, value, gameId) => {
    const lastCard = await GameService.getGameById(gameId)
    const [lastColor, lastValue] = lastCard.topcard.trim().split(/\s+/);
    if (value == "skip"){
      await PlayerToGameService.actvateSkip();
    }
    if(value == "reverse"){
      await PlayerToGameService.actvateReverse();
    }
    if(color === lastColor || value === lastValue || color === "wild"){
      return true;
    }
    throw new Error('wrong card, do you want to buy a card?');
  },

  validateBuyCard: async (numberOfCards, playerTurnPlay, nextPlayerTurn) => {
    if ( playerTurnPlay != nextPlayerTurn && playerTurnPlay != 'default') {
        throw new Error('its not the players turn');
    }
    let cards = await CardRepository.findAllCardsByPlayerId(null);
    if (cards.length === 0) {
        await PlayerToCardService.addGameCardToDeck();
        cards = await CardRepository.findAllCardsByPlayerId(null);
    }
    if (cards.length < numberOfCards) {
        throw new Error('There are not enough cards in the deck');
    }
    return cards;
  },

  validatePlayerPlay: async (playerTurnPlay, nextPlayerTurn,  playerId, card ) => {
    if ( playerTurnPlay != nextPlayerTurn && playerTurnPlay != 'default') {
        throw new Error('Its not the players turn');
    }
    if (card.player_id != playerId) {
        throw new Error('The player does not have this card.');
    }
  }

};

module.exports = PlayerToCardService;