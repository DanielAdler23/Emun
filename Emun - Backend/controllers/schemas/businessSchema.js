var mongoose = require('mongoose');
var schema = mongoose.Schema;

var businessSchema = new schema({
	name: {type:String, required:true,unique:true}, 
	sector: {type:String, required:true},
	contact: {type:String, required:true},
	address: {type:String, required:true},
	phone: {type:String, required:true, uniqe:true},
	mobile: {type:String, required:true, uniqe:true},
	web: {type:String, uniqe:true},
	mail: {type:String, required:true, uniqe:true},
	password: {type:String, required:true},
	emun: {type:Array},
	complaints: {type:Array}
},{collection: 'businesses'});


var Business = mongoose.model('Business', businessSchema);
module.exports = Business;