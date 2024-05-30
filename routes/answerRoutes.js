var express = require('express');
var router = express.Router();
var answerController = require('../controllers/answerController.js');

/*
 * GET
 */
router.get('/', answerController.list);

/*
 * GET
 */
router.get('/delete/:id/:qid', answerController.remove);
router.get('/:id', answerController.show);

/*
 * POST
 */
router.post('/', answerController.create);

/*
 * PUT
 */
router.put('/:id', answerController.update);

module.exports = router;
