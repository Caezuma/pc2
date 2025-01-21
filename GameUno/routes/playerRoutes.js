const express = require('express');
const router = express.Router();
const PlayerController = require('../controllers/playerControllers');

router.post('/', PlayerController.createPlayer);
router.get('/:id', PlayerController.getPlayerById);
router.get('/', PlayerController.getAllPlayers);
router.put('/:id', PlayerController.updatePlayer);
router.delete('/:id', PlayerController.deletePlayer);
router.patch('/:id', PlayerController.updatePlayerPartial);
router.post('/login', PlayerController.loginPlayer);
router.post('/auth', PlayerController.getPlayerByToken);
router.post('/logout', PlayerController.logoutPlayer);
router.post('/add', PlayerController.addUserGameIdByToken);
router.post('/leave', PlayerController.playerLeaveGame);


module.exports = router;
