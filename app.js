var express = require('express'),
	   path = require('path'),
	     fs = require('fs'),
 bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;

//middle ware
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function() {
	res.sendFile(path.join(__dirname, '/public/index.html'));
});
// app.get();
// app.get();

app.listen(port, function() {
	console.log("App is listening on port " + port);
});
