var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var getset = require('./controllers/getSetController');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*** Server Settings ***/
app.set('port', port);
app.use('/', express.static('./public'));
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
	res.sendFile(__dirname + '/public/404.html');
});

app.post('/login-business', function(req, res){
	res.sendFile(__dirname + '/public/404.html');
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
	var emun = req.body.emun;

	getset.insertBusiness(name, sector, contact, address, phone, mobile, web, mail, emun);

	res.send(name + ' ' + sector + ' ' + contact + ' ' + address + ' ' + phone + ' ' + mobile + ' ' + web + ' ' + mail + ' ' + emun);
});

app.post('/new-complaint', function(req, res){

	var businessID = req.body.busID;
	var userID = req.body.userID;

	var subject = req.body.complaint.subject;
	var	message = req.body.complaint.message;
	var solution = req.body.complaint.solution;

	getset.insertComplaint(subject, message, solution, businessID, userID);

	res.send(subject + ' ' + message + ' ' + solution);
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
