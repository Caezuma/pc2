const express = require('express');
const router = express.Router();
const ScoreController = require('../controllers/scoreControllers');

router.post('/', ScoreController.createScore);
router.get('/:id', ScoreController.getScoreById);
router.get('/', ScoreController.getAllScores);
router.get('/scores/:id', ScoreController.getAllScoresInGame);
router.put('/:id', ScoreController.updateScore);
router.delete('/:id', ScoreController.deleteScore);
router.patch('/:id', ScoreController.updateScorePartial);

module.exports = router;
