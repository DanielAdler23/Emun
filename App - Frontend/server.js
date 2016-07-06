var express = require('express');
var app = express();
app.use('/', express.static('./public')).listen(8080);
console.log("Client Server Is Listening On Port 8080");