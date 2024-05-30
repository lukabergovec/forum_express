var UsersModel = require('../models/usersModel.js');

/**
 * usersController.js
 *
 * @description :: Server-side logic for managing userss.
 */
module.exports = {

    /**
     * usersController.list()
     */
    list: function (req, res) {

        UsersModel.find(function (err, userss) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting users.',
                    error: err
                });
            }

            return res.json(userss);
        });
    },

    /**
     * usersController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        UsersModel.findOne({_id: id}, function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting users.',
                    error: err
                });
            }

            if (!users) {
                return res.status(404).json({
                    message: 'No such users'
                });
            }

            return res.json(users);
        });
    },

    /**
     * usersController.create()
     */
    create: async function (req, res) {
        var users = new UsersModel({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        var user = await UsersModel.findOne({username: users.username}).exec()
        if (user)
            return res.render('users/register', {err: "user allready exists"});

        users.save(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating users',
                    error: err
                });
            }

            //return res.status(201).json(users);
            return res.redirect('/login')
        });
    },

    /**
     * usersController.login()
     */
    login: function (req, res, next) {
        console.log("calling update")
        UsersModel.authenticate(req.body.username, req.body.password, function (error, user) {
            if (error || !user) {
                var err = new Error("Wrong username or password");
                err.status = 401;
                return res.render('users/login', {err: err.message});
            } else {
                try {
                    req.session.userId = user._id;
                    return res.redirect('/');
                } catch (e) {
                    return res.redirect('login', {err: e});
                }
            }
        });
    },

    /**
     * usersController.logout()
     */
    logout: function (req, res, next) {
        if (req.session) {
            req.session.destroy(function (err) {
                return res.redirect('/');
            });
        } else
            return res.redirect('/');
    },

    /**
     * usersController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UsersModel.findOne({_id: id}, function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting users',
                    error: err
                });
            }

            if (!users) {
                return res.status(404).json({
                    message: 'No such users'
                });
            }

            users.username = req.body.username ? req.body.username : users.username;
            users.email = req.body.email ? req.body.email : users.email;
            users.password = req.body.password ? req.body.password : users.password;

            users.save(function (err, users) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating users.',
                        error: err
                    });
                }

                return res.json(users);
            });
        });
    },

    /**
     * usersController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UsersModel.findByIdAndRemove(id, function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the users.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
