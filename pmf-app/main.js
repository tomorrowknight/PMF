var http = require("http");
var express = require('express');
var session = require('express-session');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var routes = require('./routes/index.js');
var chart = require('chart.js');
var flash = require('connect-flash');
var bcrypt = require('bcrypt');
const saltRounds = 10;


//start mysql connection
var connection = mysql.createConnection({
	host     : 'localhost', //mysql database host name
	user     : 'root', //mysql database user name
	password : 'moeproject16db!', //mysql database password
	database : 'tracks', //mysql database name
	dateStrings: true
});

connection.connect(function(err) {
	if (err) throw err
	console.log('You are now connected...')
})
//end mysql connection

//start body-parser configuration
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
extended: true
}));
//end body-parser configuration

//create app server
var server = app.listen(3000,  "dev.logistics.lol", function () {

	var host = server.address().address
	var port = server.address().port

	console.log("Example app listening at http://%s:%s", host, port)

});

app.use(session({
secret: 'pmfcoiscm',
resave: false,
saveUninitialized: true,
cookie: { maxAge: 300000 }
}))
app.use(flash());


var sess;

/* app.get('/login',function(req,res){
sess = req.session;
sess.username;
//Session set when user Request our app via URL
if(sess.username) {

	res.redirect('/col');
}
else {
	res.render('/login');
}
}); */

//rest api to get all results
app.get('/node', function (req, res) {
	connection.query('select * from node', function (error, results, fields) {
		if (error) throw error;
		res.end(JSON.stringify(results));
	});
});

app.get('/polygon/:id', function (req, res) {
	connection.query('select * from fence where id=?',[req.params.id], function (error, results, fields) {
		if (error) throw error;
		res.end(JSON.stringify(results));
	});
});
//rest api to get a single node data
app.get('/node/:id', function (req, res) {
	console.log(req);
	connection.query('select * from node where id=?', [req.params.id], function (error, results, fields) {
		if (error) throw error;
		res.end(JSON.stringify(results));
	});
});

//rest api to get a all fence data
app.get('/fence', function (req, res) {
	console.log(req);
	connection.query('select * from fence', function (error, results, fields) {
		if (error) throw error;
		res.end(JSON.stringify(results));
	});
});


//rest api to get the specific vehicle that is idling for a specific day
app.get('/node/vehicle/:vehicle/datetime/:datetime/speed/:speed', function (req, res) {
	if(sess.company!=null){
		var company = sess.company;
		connection.query('select COUNT (*) AS idleCount from node where vehicle=? AND datetime<? AND speed<? AND company=?', [req.params.vehicle,req.params.datetime,req.params.speed,company], function (error, results, fields) {
			if (error) throw error;
			res.end(JSON.stringify(results));
		});
	}else{
		res.redirect('/');
	}
});

//rest api to get the SPECIFIC LOCATION OF A vehicle that is idling for a specific day
app.get('/node/distance/loc/:lat1/:lon1/datetime/:datetime', function (req, res) {
	if(sess.company!=null){
		var company = sess.company;
		connection.query('SELECT COUNT (*) AS fenceCount from node where calc_distance(lat,lon,?,?) < 0.4 AND datetime<? AND company=?',[req.params.lat1,req.params.lon1,req.params.datetime,company], function (error, results, fields) {
		if (error) throw error;
		res.end(JSON.stringify(results));
		});
	}else{
		res.redirect('/');
	}
});

//rest api to create a new record into mysql database
app.post('/node', function (req, res) {
	var postData  = req.body;
	connection.query('INSERT INTO node SET ?', postData, function (error, results, fields) {
		if (error) throw error;
		res.end(JSON.stringify(results));
	});
});
//Rest API to create a new Fence with the given text and gemoetric data 
app.post('/fenceData', function (req, res) {
	areaName = req.body.areaName;
	areaAddr = req.body.areaAddr;
	areaPostal = req.body.areaPostal;
	poly = req.body.poly;
	var tempVar = poly.split(',').join(" ");
	var polyShape = tempVar.split("-").join(",");
	connection.query('INSERT INTO fence SET `name`=?,`address`=?,`postal`=?,`lat`=?,`lon`=?,`polygonTest`=PolygonFromText(?)', [areaName,areaAddr,areaPostal,0,0,"POLYGON((" + polyShape +"))"], function (error, results, fields) {
		if (error) throw error;
		res.end(JSON.stringify(results));
	});
});
//Rest API to create a new user
app.post('/signUp', function (req, res) {
	username = req.body.username;
	pwd = req.body.pwd;
	companySelect = req.body.company;
	var salt = bcrypt.genSaltSync(saltRounds);
	var hash = bcrypt.hashSync(pwd, salt);
	connection.query('INSERT INTO user SET `username`=?,`password`=?,`company`=?', [username,hash,companySelect], function (error, results, fields) {
		if (error){
			res.redirect('/signUp');
		}else{
			res.redirect('/');	
		}
		
	});
});

//Rest API to create a new user
app.post('/verifyLogin', function (req, res) {
	username = req.body.username;
	pwd = req.body.pwd;
	connection.query('SELECT * FROM user WHERE `username`=?' , [username], function (error, results, fields) {
		if (error) throw error;
		if(results[0] != null){
			var company = results[0].company;
			var dbHash = results[0].password;
			if(bcrypt.compareSync(pwd, dbHash)){
				sess = req.session;
				sess.username = username;
				sess.company = company;
				res.redirect('/col');
			}else{
				res.redirect('/');  
			}
		}else{
			res.redirect('/');
		}
	}); 
});

app.get('/logout',function(req,res){
	req.session.destroy(function(err) {
		if(err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});
//rest api to update record into mysql database
app.put('/node', function (req, res) {
	connection.query('UPDATE `employee` SET `vehicle`=?,`company`=?,`lat`=?,`lon`=?,`roadname`=? where`id`=?', [req.body.vehicle,req.body.company,req.body.lat, req.body.lng,req.body.roadname, req.body.id], function (error, results, fields) {
		if (error) throw error;
		res.end(JSON.stringify(results));
	});
});

//rest api to delete record from mysql database
app.delete('/node', function (req, res) {
	console.log(req.body);
	connection.query('DELETE FROM `node` WHERE `id`=?', [req.body.id], function (error, results, fields) {
		if (error) throw error;
		res.end('Record has been deleted!');
	});
});


// ================================================================
// setup our express application
// ================================================================
app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs');
// ================================================================
// setup routes
// ================================================================
routes(app);