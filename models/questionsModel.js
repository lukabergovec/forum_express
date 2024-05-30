var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var questionsSchema = new Schema({
	'title' : String,
	'author_id' : {
		type: Schema.Types.ObjectId,
		ref: 'users'
   },
	'text' : String,
	'answer' :{
		type: Schema.Types.ObjectId,
		ref: 'answer'
   },
   	'tags': Array,
	'date' : Date
});

module.exports = mongoose.model('questions', questionsSchema);
