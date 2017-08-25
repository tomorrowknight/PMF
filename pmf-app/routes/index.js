'use strict';
module.exports = function(app) {
	app.get('/', function(req, res) {
		if(req.session.username !=null){
			res.render('pages/col');
		}else{
			res.render('pages/login');
		}
	});
	app.get('/signup', function(req, res) {
		if(req.session.username !=null){
			res.render('pages/col');
		}else{
			res.render('pages/signup');
		}	
	});
	app.get('/about', function(req, res) {
		res.render('pages/about');
	});
	app.get('/primer', function(req, res) {
		app.get('/col', function(req, res) {
		if(req.session.username !=null){
			res.render('pages/primer');
		}else{
			res.redirect('/');
		}
	});
		
	});
	app.get('/col', function(req, res) {
		if(req.session.username !=null){
			res.render('pages/col');
		}else{
			res.redirect('/');
		}
	});
	app.get('/demarcate', function(req, res) {
		if(req.session.username !=null){
			res.render('pages/demarcate');
		}else{
			res.redirect('/');
		}
	});

};