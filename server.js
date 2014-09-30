var application_root=__dirname;
var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var errorHandler=require("errorhandler");
var path=require("path");

var app=express();

var dbUrl=process.env.DATABASE_URL;
console.log("dbUrl=" + dbUrl);
var collections=["things"];
var db=require("mongojs").connect(dbUrl, collections);

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

	db.things.find('', function(err, users){
		if(err){
			console.log(err);
			res.send(":::"+err);
		}
		//if(err)	res.send(process.env);
		else if(!users)	res.end("No users found.");
		else{
			res.writeHead(200, {'Content-Type':'application/json'});
			str='[';
			users.forEach(function(user){
				str = str + '{';
				str = str + '"username":"'+user.username+'",';
				str = str + '"email":"'+user.email+'",';
				str = str + '"password":"'+user.password+'"';
				str = str + '},';
			});
			str = str.trim();
			str=str.substring(0, str.length-1);
			str=str+']';
			console.log(str);
			res.end(str);
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