var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/hook', function(req, res) {  
	var error = function(err, stderr){
		console.log('stderr: ' + stderr);
		console.log('exec error: ' + err);
		exec('git reset HEAD@{1}' function (error, stdout, stderr) {
			console.log('stdout: ' + stdout);
			if (error !== null){
				error(error, stderr);
				return;
			}else //restart server
				exec('npm install',
					function (error, stdout, stderr) {
						console.log('stdout: ' + stdout);
						if (error !== null){
							error(error, stderr);
							return;
						}else
							exec('forever restart mad.js',
								function (error, stdout, stderr) {
									console.log('stdout: ' + stdout);
									if (error !== null){
										error(error, stderr);
										return;
									}
									res.send(200, {});
							});
					});
		});
	}

	//pull
	exec('git pull',
		function (error, stdout, stderr) {
			console.log('stdout: ' + stdout);
			if (error !== null){
				error(error, stderr);
				return;
			}else //restart server
				exec('npm install',
					function (error, stdout, stderr) {
						console.log('stdout: ' + stdout);
						if (error !== null){
							error(error, stderr);
							return;
						}else
							exec('forever restart mad.js',
								function (error, stdout, stderr) {
									console.log('stdout: ' + stdout);
									if (error !== null){
										error(error, stderr);
										return;
									}
									res.send(200, {});
							});
					});
		});
	
});

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
