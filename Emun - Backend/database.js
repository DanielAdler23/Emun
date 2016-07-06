//---------------------------------Connect Tp MongoDB On Mlab Via Mongoose--------------------------------------//
var mongoose = require('mongoose');
config = { mongoUrl: 'mongodb://emun:emun@ds011314.mlab.com:11314/emun' };

//OHAD MONGO - mongodb://emun:emun@ds011314.mlab.com:11314/emun
//DANIEL MONGO - mongodb://emun:emun@ds013024.mlab.com:13024/emun

//The Server Option Auto_Reconnect Is Defaulted To True
var options = {
	server: {
		auto_reconnect:true,
	}
};

mongoose.connect(config.mongoUrl, options);
db = mongoose.connection;//A Global Connection Variable

//Event Handlers For Mongoose
db.on('error', function(err){
	console.log('Mongoose: Error: ' + err);
});

db.on('open', function(){
	console.log('Mongoose: Connection Established');
});

db.on('disconnected', function(){
	console.log('Mongoose: Connection Stopped, Reconnect');
	mongoose.connect(config.mongoUrl, options);
});

db.on('reconnected', function(){
	console.log('Mongoose Reconnected!');
});