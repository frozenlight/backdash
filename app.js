
////////////////////////////////////////////////////////////
// 
// 				**APP INFORMATION**
//
// App name: 		\\dash
// App full name: 	backslash-dashoard
// App alias: 		backdash
//
// Author: 			Ole Anders Stokker
// Alias: 			oleast
// Alias2: 			frozenlight
//
// Description: 	A unified dashboard for all devices
// 					made to replace standard Chrome or
//					other browsers dashboard/home page.
//
// Other: 			I like using four spaces, deal with it.
//
// Date started: 	24.10.2016 22:00
//
////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
// Import statements
////////////////////////////////////////////////////////////

// Import node modules
var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var nunjucks = require('nunjucks')
var mongoose = require('mongoose')

// Import routes
var routes = require('./routes/index')
var users = require('./routes/users')

////////////////////////////////////////////////////////////
// Main app setup for Express
////////////////////////////////////////////////////////////

//initialize Express app
var app = express()

// Connect to MongoDB via the Mongoose adapter
mongoose.connect('mongodb://localhost/fodash-test')

// Set standard HTML view/template directory
app.set('views', path.join(__dirname, 'views'))

// Set standard HTML render engine to nunjucks
nunjucks.configure('views', {
		autoescape: true,
		express: app
})

app.engine( 'html', nunjucks.render ) 
app.set( 'view engine', 'html' )

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// Set logger to developer mode for logging in terminal
app.use(logger('dev'))

// Initialize body parser for POST requests for HTML and JSON
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Initialize cookie parser
app.use(cookieParser())

// Set Standard public file directory 
// This will be fully accessible for users
app.use(express.static(path.join(__dirname, 'public')))

// Add the imported routes and make them usable for the app
app.use('/', routes)
app.use('/users', users)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found')
	err.status = 404
	next(err)
})

////////////////////////////////////////////////////////////
// Error handlers
////////////////////////////////////////////////////////////

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500)
		res.render('error', {
			message: err.message,
			error: err
		})
	})
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500)
	res.render('error', {
		message: err.message,
		error: {}
	})
})


module.exports = app
