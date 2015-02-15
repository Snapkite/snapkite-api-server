var SNAPKITE_CONFIG = require('./config.json');

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var app = express();

app.set('port', process.env.PORT || SNAPKITE_CONFIG.server.port);
//
// http://stackoverflow.com/a/19965089
//
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var server = http.createServer(app).listen(app.get('port'), function () {
  console.log('[Snapkite] Express server listening on port ' + app.get('port'));
});

require('./controllers/database')(SNAPKITE_CONFIG.database);

//
// Routes
//

var router = express.Router();

function handleGetTweets(req, res) {
  var keyword;
  var numberOfTweets = 10;
  var offset = 0;

  if (typeof req.params.numberOfTweets !== 'undefined') {
    numberOfTweets = req.params.numberOfTweets;
  }

  if (typeof req.params.keyword !== 'undefined') {
    keyword = req.params.keyword;
  }

  if (typeof req.params.offset !== 'undefined') {
    offset = req.params.offset;
  }

  if (numberOfTweets > 50) {
    numberOfTweets = 50;
  }

  if (typeof keyword !== 'undefined') {

    require('./controllers/tweet').getKeyword(keyword, numberOfTweets, offset, function (error, tweets) {
      if (error) {
        res.json(500);
        return;
      }

      res.json(tweets);
    });

  } else {

    require('./controllers/tweet').getAll(numberOfTweets, offset, function (error, tweets) {
      if (error) {
        res.json(500);
        return;
      }

      res.json(tweets);
    });
  }
}

router.get('/api/1.0/tweets/all', handleGetTweets);
router.get('/api/1.0/tweets/all/:numberOfTweets', handleGetTweets);
router.get('/api/1.0/tweets/all/:numberOfTweets/:offset', handleGetTweets);
router.get('/api/1.0/tweets/keyword/:keyword', handleGetTweets);
router.get('/api/1.0/tweets/keyword/:keyword/:numberOfTweets', handleGetTweets);
router.get('/api/1.0/tweets/keyword/:keyword/:numberOfTweets/:offset', handleGetTweets);

app.use(router);
