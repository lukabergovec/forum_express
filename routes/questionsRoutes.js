var express = require('express');
var router = express.Router();
var questionsController = require('../controllers/questionsController.js');

/*
 * GET
 */
router.get('/', questionsController.listPersonal);

/*
 * GET
 */

router.get('/answer/:id/:aid', questionsController.answer);
router.get('/delete/:id', questionsController.remove);
router.get('/:id', questionsController.show);

/*
 * POST
 */
router.post('/', questionsController.create);

/*
 * PUT
 */
router.put('/:id', questionsController.update);

module.exports = router;
