var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
	first_name: {type:String, required:true},
	last_name: {type:String, required:true},
	user_name: {type:String, required:true,unique:true, index:1},
	email: {type:String, required:true,unique:true},
	password: {type:String, required:true},
	complaints: {type: Array}
	},{collection: 'users'});


var User = mongoose.model('User', userSchema);
module.exports = User;