var mongoose = require('mongoose');
var schema = mongoose.Schema;

var complainSchema = new schema({
	subject: {type:String, required:true},
	message: {type:String, required:true},
	solution: {type:String},
	userID: {type:String},
	businessID: {type:String}
	},{collection: 'complaints'});


var Complaint = mongoose.model('Complaint', complainSchema);
module.exports = Complaint;