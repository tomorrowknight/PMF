var http = require("http");
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');

//start mysql connection
var connection = mysql.createConnection({
  host     : 'localhost', //mysql database host name
  user     : 'root', //mysql database user name
  password : 'moeproject16db!', //mysql database password
  database : 'tracks' //mysql database name
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
var server = app.listen(3000,  "127.0.0.1", function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});

//rest api to get all results
app.get('/nodes', function (req, res) {
   connection.query('select * from nodes', function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});
<div style="clear:both; margin-top:0em; margin-bottom:1em;"><a href="http://www.js-tutorials.com/javascript-tutorial/how-to-process-or-iterate-on-javascript-json-objects-in-javascript/" target="_blank" rel="nofollow" class="u8e634361979ca7336a168525d2b8c99c"><!-- INLINE RELATED POSTS 3/3 //--><div class="centered-text-area"><div class="centered-text" style="float: left;"><div class="u8e634361979ca7336a168525d2b8c99c-content"><span class="ctaText">Also Read :</span>  <span class="postTitle">How to Process/Iterate on JSON Objects in JavaScript</span></div></div></div><div class="ctaButton"></div></a></div>
//rest api to get a single employee data
app.get('/nodes/:id', function (req, res) {
   console.log(req);
   connection.query('select * from nodes where id=?', [req.params.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

//rest api to create a new record into mysql database
app.post('/nodes', function (req, res) {
   var postData  = req.body;
   connection.query('INSERT INTO nodes SET ?', postData, function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

//rest api to update record into mysql database
app.put('/nodes', function (req, res) {
   connection.query('UPDATE `employee` SET `employee_name`=?,`employee_salary`=?,`employee_age`=? where `id`=?', [req.body.employee_name,req.body.employee_salary, req.body.employee_age, req.body.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

//rest api to delete record from mysql database
app.delete('/nodes', function (req, res) {
   console.log(req.body);
   connection.query('DELETE FROM `nodes` WHERE `id`=?', [req.body.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end('Record has been deleted!');
	});
});