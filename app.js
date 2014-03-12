
/**
 * Module dependencies.
 */
var fs = require('fs');
var accessLogfile = fs.createWriteStream('access.log', {flags: 'a'}); 
var errorLogfile = fs.createWriteStream('error.log', {flags: 'a'});

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var util = require('util');
var MongoStore = require('connect-mongo')(express);
var settings = require("./settings");
var flash = require('connect-flash');
partials = require('express-partials');

var app = express();

app.use(partials());


app.configure(function(){
	app.use(express.logger({stream: accessLogfile}));
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');
	app.use(flash());
	// app.use(express.bodyParser());
	app.use(express.json());
  	app.use(express.urlencoded()); 
	app.use(express.methodOverride()); 
	app.use(express.cookieParser()); 
	app.use(express.session({
		secret: settings.cookieSecret, 
		store: new MongoStore({
      		db: settings.db
    	})
	}));
	app.use(function(req, res, next){
		res.locals.error = req.flash('error').toString();
		res.locals.success = req.flash('success').toString();
		res.locals.user = req.session ? req.session.user : null;
		next();
	});
	app.use(app.router); 
	app.use(express.static(__dirname + '/public'));
})

// all environments
app.set('port', process.env.PORT || 3000);
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.set('view options',{ layout: true});

app.use(express.favicon());
app.use(express.logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded());
app.use(express.methodOverride());
// app.use(app.router);
// app.use(express.static(path.join(__dirname, 'public')));

routes(app);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.configure('production', function(){ 
	app.error(function (err, req, res, next) {
	var meta = '[' + new Date() + '] ' + req.url + '\n';
        errorLogfile.write(meta + err.stack + '\n');
		next(); 
	});
});


if (!module.parent){
	http.createServer(app).listen(3000);
	// http.createServer(app).listen(app.get('port'), function(){
 	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
	// });
}

