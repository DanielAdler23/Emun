var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var session = require('express-session');
var getset = require('./controllers/getSetController');
var bodyParser = require('body-parser');

//var routesArray = ['/login-user', '/login-business', '/user-portal', '/business-portal'];

/*** Server Settings ***/
app.set('port', port);
app.use('/', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({cookie:{path: '/', secure: false},secret:"emunadmin2016", resave:false, saveUninitialized:false}));
app.use(function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control_Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.set("Content-Type", "application/x-www-form-urlencoded");
	next();
});


app.get('*', function(req, res){
	console.log("WORKS!!!");
	req.next();
});

app.get('/home', function(req, res){
	res.sendFile(__dirname + '/public/404.html');
});

app.post('/login-user', function(req, res){
	var username = req.body.username;
	var pass = req.body.password;

	getset.login(username, pass, 0,  function(user){
		
		if(!user) {
			return res.status(404).send();
		}

		session.user = user;
		if(session.user){
			console.log("USER COOKIE WAS CREATED!");
			res.json(user);
		}
		else
			return res.status(404).send();
	});
});



app.post('/login-business', function(req, res){
	var email = req.body.username;
	var pass = req.body.password;

	getset.login(email, pass, 1, function(user){
		
		if(!user) {
			return res.status(404).send();
		}

		session.business = user;
		if(session.business){
			console.log("USER COOKIE WAS CREATED!");
			res.json(user);
		}
		else
			return res.status(404).send();
	});
});



app.post('/user-portal', function(req, res){
	if(!session.user){
		return res.status(401).send();
	}

	getset.getComplaints(session.user, function(portalInfo){

		res.json(portalInfo);
	});
});

app.post('/business-portal', function(req, res){

});

app.post('/logoutUser', function(req, res){
	session.user = null;
	if(session.user !== null)
		return res.status(500).send();

	return res.status(200).send();
});

app.post('/logoutBusiness', function(req, res){
	session.business = null;
	if(session.business !== null)
		return res.status(500).send();

	return res.status(200).send();
});


app.post('/new-user', function(req, res){
	
	var first = req.body.first;
	var last = req.body.last;
	var user = req.body.user;
	var email = req.body.email;
	var pass = req.body.pass;

	getset.insertUser(first, last, user, email, pass);

	res.send(first + ' ' + last + ' ' + user + ' ' + email + ' ' + pass);
});

app.post('/new-business', function(req, res){

	var name = req.body.name;
	var sector = req.body.sector;
	var contact = req.body.contact;
	var address = req.body.address;
	var phone = req.body.phone;
	var mobile = req.body.mobile;
	var web = req.body.web;
	var mail = req.body.mail;
	var password = req.body.newPassword;
	var emun = req.body.emun;

	getset.insertBusiness(name, sector, contact, address, phone, mobile, web, mail, password, emun);

	res.send(name + ' ' + sector + ' ' + contact + ' ' + address + ' ' + phone + ' ' + mobile + ' ' + web + ' ' + mail + ' ' + emun);
});

app.post('/new-complaint', function(req, res){

	var businessID = req.body.busID;
	var businessNAME = req.body.busNAME;
	var userID = req.body.userID;
	var complaintID;

	var subject = req.body.complaint.subject;
	var	message = req.body.complaint.message;
	var solution = req.body.complaint.solution;

	getset.insertComplaint(subject, message, solution, businessID, userID, businessNAME, function(id){
		var package = {
			"Subject": subject,
			"Message": message,
			"Solution": solution,
			"Id": id
		};

		res.send(package);
	});

	
});


app.post('/search-business', function(req, res){
	if(req.body.sector == null)
		req.body.sector = "";
	if(req.body.name == null)
		req.body.name = "";
	if(req.body.emun == null)
		req.body.emun = "";

	var query = getset.getBusiness(req.body.name, req.body.sector, req.body.emun);
	query.exec(function(err, user){
		if(err) throw err;
		res.json(user);
	});
});


app.listen(port);
console.log("Service Is Listening On Port " + port);
