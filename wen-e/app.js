
/**
 * Module dependencies.
 */

var express = require('express');
var connection = require('./connection');
var routes = require('./routes');
var user = require('./routes/user');
var data = require('./routes/sentence_processing');
var http = require('http');
var path = require('path');




var app = express();

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/article',data.article_list);
app.get('/sentence',data.sentence_list);
app.get('/search',data.search_word);
app.get('/tosentence',data.article_to_sentence);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
