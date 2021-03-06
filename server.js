var application_root=__dirname;
var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var errorHandler=require("errorhandler");
var path=require("path");

var app=express();

var dbUrl = process.env.DATABASE_URL;
console.log("dbUrl=" + dbUrl);
var collections = ["things"];

var client = require('mongodb').MongoClient;
var db;
client.connect(dbUrl, function(err, connectedDb){
	console.log('connect(err:'+err+',theDb:'+connectedDb);
	db = connectedDb;
	db.things = db.collection('things');
});

//	crossdomain
app.use(function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");

	if(req.method == 'OPTIONS'){
		res.send(200);
	}
	else{
		next();
	}
});


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(methodOverride());
app.use(errorHandler({dumpExceptions:true, showStack:true}));

app.set('port', (process.env.PORT || 5000));
console.log('port: '+app.get('port'));
app.set('view engine', 'html');


app.get('/', function (req, res){
	res.send('Our sample API is up...');
});

app.get('/getallusers', function(req, res){

	console.log('HANDLING "/getallusers" request...');

	var cursor;
	var users = db.things.find({}, function(err, _cursor){
		console.log('find error: '+err);
		cursor=_cursor;
	});

	res.writeHead(200, {'Content-Type':'application/json'});

	console.log('Building the response...');
	var str = '[';
	cursor.each(function(err, user){
		console.log('each error: '+err);
		console.log('each user: '+user);
		if(user)
		{
			str = str + '{';
			str = str + '"username":"'+user.username+'",';
			str = str + '"email":"'+user.email+'",';
			str = str + '"password":"'+user.password+'"';
			str = str + '},';
			console.log(str);
		}
		else	//is a null user the sign that we've just handled the last element?
		{
			str = str.trim();
			str = str.substring(0, str.length-1);
			str = str + ']';
			console.log('Built response: '+str);
			res.end(str);

			console.log('HANDLED "/getallusers" request!');
		}
	});

	
});

app.post('/insertuser', function(req, res){
	console.log("POST: ");
	console.log(req.body);
	var prop;
	for(prop in req.body);	//the client shall send a conventional 'user={...}' but we want to decouple the server from this convention and grab this prop name dynamically
	var user = req.body[prop];
	console.log(user);
	var jsonData=JSON.parse(user);
	db.things.save(
		{email:jsonData.email, password:jsonData.password, username:jsonData.username}, 
		function(err, saved){
			if(err){
				res.send(err);
			}
			else if(!saved){
				res.send('User not saved.');
			}
			else{
				res.send('User saved.');
			}
		}
	);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});