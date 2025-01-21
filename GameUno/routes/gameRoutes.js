const express = require('express');
const router = express.Router();
const GameController = require('../controllers/gameControllers');
const CacheConfig = require('../config/cacheConfig');


router.post('/', GameController.createGame);
router.get('/alldata/:id', GameController.playerGetAllGameData);
router.get('/history', GameController.gameTurnHistory);
router.get('/:id', GameController.getGameById);
router.get('/status/:id', GameController.getGameStatusById);
router.get('/', GameController.getAllGames); 
router.get('/all/:id', GameController.getAllPlayersInGame); 
router.get('/turn/:id', GameController.getTurnGamePlayer); 
router.get('/top/:id', GameController.getTopCardgame); 
router.put('/:id', GameController.updateGame);
router.delete('/:id', GameController.deleteGame);
router.patch('/:id', GameController.updateGamePartial);
router.post('/end', GameController.playerEndGame);
router.post('/start', GameController.playerStartGame);
router.post('/cache', CacheConfig.cacheSettings);
module.exports = router;
