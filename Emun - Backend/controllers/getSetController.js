var mongoose = require('mongoose');
var User = require('./schemas/userSchema');
var Business = require('./schemas/businessSchema');
var Complaint = require('./schemas/complaintSchema');


exports.insertUser = function(_first, _last, _user, _email, _pass){
	var newUser = new User({
		first_name: _first,
		last_name: _last,
		user_name: _user,
		email: _email,
		password: _pass,
	});

	newUser.save(function(err, doc){
		if(err)
			console.log(err);
		else{
			console.log("\nSaved User: " + doc);
			return;
		}
	});
};



exports.insertBusiness = function(_name, _sec, _contact, _addr, _phone, _mob, _web, _mail, _emun){
	var newBusiness = new Business({
		name: _name,
		sector: _sec,
		contact: _contact,
		address: _addr,
		phone: _phone,
		mobile: _mob,
		web: _web,
		mail: _mail,
		emun: _emun,
	});

	newBusiness.save(function(err, doc){
		if(err)
			console.log(err);
		else{
			console.log("\nSaved Business: " + doc);
			return;
		}
	});
};


exports.insertComplaint = function(_sub, _mess, _sol, _businessID, _userID, next){

	var newComplaint = new Complaint({
		subject: _sub,
		message: _mess,
		solution: _sol
	});

	newComplaint.save(function(err, doc){
		if(err)
			console.log(err);
		else{
			console.log("\nSaved Complaint: " + doc);
			//console.log(doc._id);
			var compID = doc._id;
			next(doc._id);

			Business.update({"_id": _businessID}, {$push: {"complaints": compID}}, function(err, numAffected){
				if(err){
                	console.log(err);
                }
				else{
               		console.log("Successfully added");
       			 }	
			});

			User.update({"_id": _userID}, {$push: {"complaints": compID}}, function(err, numAffected){
				if(err){
                	console.log(err);
                }
				else{
               		console.log("Successfully added");
       			 }	
			});
			return;
		}
	});
	
};


exports.getComplaints = function(_userID, next){
	var portalInfo;
	User.findOne({_id: _userID},{first_name:0, last_name:0, user_name:0, email:0, password:0},  function(err, complaints){
		if(err) { console.log(err); }
		
		next(complaints);
	});
};



exports.getBusiness = function(_name, _sector, _emun){
	var query = Business.find({});

	if(_name !== "")
		query.where('name').equals(_name);
	if(_sector !== "")
		query.where('sector').equals(_sector);
	if(_emun !== ""){
		if(!Array.isArray(_emun))
			query.where('emun').equals(_emun);
		else{
			for(i = 0; i < _emun.length; i++)
				query.where('emun').in([_emun[i]]);
		}
		
	}

	if(_name == "" && _sector == "" && _emun == "")
		query = Business.find({});

	return query;
};

exports.login = function(_username, _pass, next){
	User.findOne({user_name: _username, password: _pass}, function(err, user){
		if(err) { console.log(err); }
		next(user);
	});
};