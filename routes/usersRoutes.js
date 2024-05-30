var express = require('express');
var router = express.Router();
var usersController = require('../controllers/usersController.js');

/*
 * GET
 */
router.get('/', usersController.list);
router.get('/logout', usersController.logout);
router.get('/:id', usersController.show);

/*
 * POST
 */
//router.post('/', usersController.create);
router.post('/login', usersController.login);
router.post('/register', usersController.create);

/*
 * PUT
 */
router.put('/:id', usersController.update);

/*
 * DELETE
 */
router.delete('/:id', usersController.remove);

module.exports = router;
