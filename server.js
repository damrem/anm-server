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

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride());
//app.use(express.static(path.join(application_root, "client/dist/")));
app.use(errorHandler({dumpExceptions:true, showStack:true}));

app.set('port', (process.env.PORT || 5000));
console.log('port: '+app.get('port'));
app.set('view engine', 'html');
/*
app.get('/', function (req, res){
	res.render('client/');
});
*/
app.all("*", function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "GET, POST");
	next();
});

app.get('/api', function (req, res){
	res.send('Our sample API is up...');
});

app.get('/getallusers', function(req, res){
	//required for crossdomain
	//res.header("Access-Control-Allow-Origin", "*");
	//res.header("Access-Control-Allow-Headers", "X-Requested-With");
	

	db.things.find('', function(err, users){
		if(err)	res.send(""+err);
		//if(err)	res.send(process.env);
		else if(!users)	res.end("No users found.");
		else{
			res.writeHead(200, {'Content-Type':'application/json'});
			str='[';
			users.forEach(function(user){
				str=str+'{"name":"'+user.username+'"},'+'\n';
			});
			str = str.trim();
			str=str.substring(0, str.length-1);
			str=str+']';
			res.end(str);
		}
	});
});

app.post('/insertuser', function(req, res){
	console.log("POST: ");
	//res.header("Access-Control-Allow-Origin", "http://localhost:"+app.get('port'));
	//res.header("Access-Control-Allow-Methods", "GET, POST");

	console.log(req.body);
	console.log(req.body.mydata);
	var jsonData=JSON.parse(req.body.mydata);
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

app.get('/getuser', function(req, res){
	res.send("getuser");
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});