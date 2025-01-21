const express = require('express');
const router = express.Router();
const CardController = require('../controllers/cardControllers');

router.post('/', CardController.createCard);
router.post('/hands', CardController.getAllPlayerCards);
router.post('/say', CardController.sayUno);
router.post('/challenge', CardController.challengeUno);
router.post('/play/:id', CardController.cardPlayer);
router.post('/buy/:id', CardController.buyCard);
router.get('/:id', CardController.getCardById);
router.get('/', CardController.getAllCards);
router.get('/values/:id', CardController.getAllCardsValues);
router.post('/distribute', CardController.distributeCards);
router.put('/:id', CardController.updateCard);
router.delete('/:id', CardController.deleteCard);
router.patch('/:id', CardController.updateCardPartial);

module.exports = router;
