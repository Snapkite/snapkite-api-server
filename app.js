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

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('[Snapkite] Express server listening on port ' + app.get('port'));
});

require('./controllers/database')(SNAPKITE_CONFIG.database);

//
// Routes
//

var router = express.Router();

router.get('/api/tweets/all/:numberOfTweets', function (req, res) {
  var numberOfTweets = req.params.numberOfTweets;

  //
  // Validate
  //
  if (numberOfTweets > 50) {
    numberOfTweets = 50;
  }

  require('./controllers/tweet').getAll(numberOfTweets, function (error, tweets) {
    if (error) {
      res.json(500);
      return;
    }

    res.json(tweets);
  });
});

router.get('/api/tweets/keyword/:keyword/:numberOfTweets', function (req, res) {
  var numberOfTweets = req.params.numberOfTweets;
  var keyword = req.params.keyword;

  //
  // Validate
  //
  if (numberOfTweets > 50) {
    numberOfTweets = 50;
  }

  require('./controllers/tweet').getKeyword(keyword, numberOfTweets, function (error, tweets) {
    if (error) {
      res.json(500);
      return;
    }

    res.json(tweets);
  });
});

app.use(router);