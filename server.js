const express = require("express");
const bodyParser = require("body-parser");
var http = require('http');
const app = express();
const router = express.Router();

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
	);
	next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/index.html')); // set the static files location
// app.use(morgan('dev'));

// app.use(cookieParser());
// app.use(expressSession({
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: false
// }));

// app.use(passport.initialize());
// app.use(passport.session());
// require('./server/config/passport')(app, passport);
// require('./server/route')(app, passport);
// app.use(flash());
// if (config.env === 'development') {

//     app.use(function(err, req, res, next) {
//         console.log(err);
//         return res.status(500).json({ message: err.message });
//     });

// }

// app.use(function(err, req, res, next) {
//     return res.status(500).json({ message: err.message });
// });

http.createServer(function (req, res) {
	res.sendFile(path.join(__dirname + "/index.html"));
})

// router.get("/", function(req, res) {
//   res.sendFile(path.join(__dirname + "/index.html"));
// });


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening on port " + port + " ... ");
});
