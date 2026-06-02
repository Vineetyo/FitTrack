const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const auth = require('../middleware/authMiddleware');

router.get('/',              auth, logController.getLogs);
router.post('/',             auth, logController.createLog);
router.put('/:id',           auth, logController.updateLog);
router.delete('/:id',        auth, logController.deleteLog);
router.get('/progress/:taskId', auth, logController.getProgress);

module.exports = router;
