var QuestionsModel = require('../models/questionsModel.js');
var AnswerModel = require('../models/answerModel.js');
var UsersModel = require('../models/usersModel.js');

/**
 * questionsController.js
 *
 * @description :: Server-side logic for managing questionss.
 */
module.exports = {

    /**
     * questionsController.list()
     */
    list: function (req, res) {
        QuestionsModel.find().sort({date : 'desc'}).populate('author_id').exec(function (err, questionss) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting questions.',
                    error: err
                });
            }
            return res.render('questions/index', { uid: req.session.userId , questions: questionss});
        });
    },

    listPersonal: function (req, res) {
        console.log("listing personal")
        QuestionsModel.find({author_id: req.session.userId}).populate('author_id').sort({date : 'desc'}).exec(function (err, questionss) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting questions.',
                    error: err
                });
            }
            return res.render('questions/index', { uid: req.session.userId , questions: questionss});
        });
    },

    /**
     * questionsController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        var userid = req.session.userId;

        QuestionsModel.findOne({_id: id}).populate('author_id').exec(function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting questions.',
                    error: err
                });
            }

            if (!question) {
                return res.status(404).json({
                    message: 'No such questions'
                });
            }

            if(question.author_id._id == userid){
                question.owner = true;
            }

            AnswerModel.find({questionId: id}).populate('author_id').exec( async function (err, answer) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting answer.',
                        error: err
                    });
                }
    
                if (!answer) {
                    return res.status(404).json({
                        message: 'No such answer'
                    });
                }
    
                for (i of answer){
                    try{
                            
                        if(i.author_id._id == userid){
                            i.owner = true;
                        }

                        if(question.answer){
                            i.correct = 1;
                        }
                            
                    }catch{}
                    
                }
                if(question.answer){
                    var cur = await AnswerModel.findOne({_id: question.answer}).exec();
                }
                
                return res.render('questions/one', {question: question, uid: userid, answers: answer, correct: cur })
            });
            
        });
    },

    /**
     * questionsController.create()
     */
    create: function (req, res) {
        var questions = new QuestionsModel({
			title : req.body.title,
			text : req.body.text,
            author_id : req.session.userId,
            tags : [],
			date : new Date()
        });

        req.body.tags.split(',').forEach(element => {
            questions.tags.push(element);    
        });

        questions.save(function (err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating questions',
                    error: err
                });
            }

            return res.redirect('/questions/' + questions._id);
        });
    },

    /**
     * questionsController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        QuestionsModel.findOne({_id: id}, function (err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting questions',
                    error: err
                });
            }

            if (!questions) {
                return res.status(404).json({
                    message: 'No such questions'
                });
            }

            questions.title = req.body.title ? req.body.title : questions.title;
			questions.text = req.body.text ? req.body.text : questions.text;
			questions.date = req.body.date ? req.body.date : questions.date;
			
            questions.save(function (err, questions) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating questions.',
                        error: err
                    });
                }

                return res.json(questions);
            });
        });
    },
    answer: function (req, res) {
        var id = req.params.id;
        var answer_id = req.params.aid;

        QuestionsModel.findOne({_id: id}, function (err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting questions',
                    error: err
                });
            }

            if (!questions) {
                return res.status(404).json({
                    message: 'No such questions'
                });
            }
            questions.answer = answer_id;
			
            questions.save(function (err, questions) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating questions.',
                        error: err
                    });
                }

                return res.redirect('/questions/' + id);
            });
        });
    },

    /**
     * questionsController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        try{
            QuestionsModel.findByIdAndRemove(id,function (err, _) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the questions.',
                        error: err
                    });
                }
                AnswerModel.remove({questionId: id}, function (err, _){
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when deleting the answers.',
                            error: err
                        });
                    }
                });
            });
        }catch(e){
            console.log("wierd delete" + e)
        }
        return res.redirect('/questions');
    }
};
