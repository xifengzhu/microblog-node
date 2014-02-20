
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var util = require('util');
var MongoStore = require('connect-mongo')(express);
var settings = require("./settings");
partials = require('express-partials');

var app = express();

app.use(partials());


app.configure(function(){
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');
	app.use(express.bodyParser()); 
	app.use(express.methodOverride()); 
	app.use(express.cookieParser()); 
	app.use(express.session({
		secret: settings.cookieSecret, 
		store: new MongoStore({
      db: settings.db
    })
	}));
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
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
// app.use(app.router);
// app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/u/:users', routes.user);
app.post('/post', routes.post);
app.get('/reg', routes.doReg);
app.get('/login', routes.login);
app.post('/login',routes.doLogin);
app.get('logout', routes.logout);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
