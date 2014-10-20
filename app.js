/**
 * Module dependencies.
 */

//Global variables : Since they are not declared using the var keyword
var express = require('express'),
	rootDir = __dirname,
	config = require('./config'),
	http = require('http'),
	path = require('path'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	mw = {
		requestlogger: require('./middleware/requestlogger')
	},
	app = express();

var passport = require('passport'),
	flash = require('connect-flash');

require('./config/passport')(passport); // pass passport for configuration


// Object that stores application level settings
// that are used by the routes
// This avoids the need to create global variables
// and also help in testing since you can inject
// any configuration you wish to test
var settings = {
	config: config,
	passport: passport
	//, knex: knex
};

// all environments
app.set('port', config.PORT || process.env.port || 3000);
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
	secret: config.SESSION_SECRET,
	saveUninitialized: true,
	resave: true
}));
app.use(express.static(__dirname + '/public'));

// Authentication setup using Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// ---

// Our custom middleware
app.use(mw.requestlogger);

//This allows you to require files relative to the root http://goo.gl/5RkiMR
requireFromRoot = (function(root) {
    return function(resource) {
        return require(root+"/"+resource);
    }
})(__dirname);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

routes = require('./routes')(app, settings);