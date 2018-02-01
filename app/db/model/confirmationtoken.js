var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var confirmationTokenSchema = new Schema({
	token : {
		type : String,
		required : true,
		unique : true
	},
	email : {
		type : String,
		required : true,
		unique : true
	},	
	created_at : { type: Date, default: Date.now }
});

// the schema is useless so far
// we need to create a model using it
var ConfirmationToken = mongoose.model('ConfirmationToken', confirmationTokenSchema);

// make this available to our users in our Node applications
module.exports = ConfirmationToken;