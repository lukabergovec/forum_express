var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var answerSchema = new Schema({
	'questionId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'questions'
	},
	'author_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'users'
	},
	'text' : String
});

module.exports = mongoose.model('answer', answerSchema);
