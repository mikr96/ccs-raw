const express = require("express");
const bodyParser = require("body-parser");
var http = require('http');
const app = express();
const router = express.Router();

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
	);
	res.header("Content-Security-Policy", "default-src * 'self' 'unsafe-inline' 'unsafe-eval'; script-src * 'self' 'unsafe-inline' 'unsafe-eval' localhost:*/* https://apis.google.com");
	next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/')); // mcm tak guna je ... 
console.log(__dirname);
// http.createServer(function (req, res) {
// 	res.sendFile(path.join(__dirname + "/page-login.html"));
// })

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log("Listening on port " + port + " ... ");
});
