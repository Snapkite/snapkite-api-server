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

function handleGetTweet(req, res) {
  var tweetId;

  if (typeof req.params.tweetId !== 'undefined') {
    tweetId = req.params.tweetId;
  }

  require('./controllers/tweet').get(tweetId, function (error, tweet) {
    if (error) {
      res.json(500);
      return;
    }

    res.json(tweet);
  });
}

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

function handleSetCollection(req, res) {

  var tweetIds = [];
  var collectionId;

  if (typeof req.body.tweetIds !== 'undefined') {
    tweetIds = req.body.tweetIds;
  }

  if (typeof req.body.collectionId === 'undefined') {
    console.error('[Snapkite] Missing request data: collectionId');

    res.json({
      error: 'Missing request data'
    });

    return;
  }

  collectionId = req.body.collectionId;

  require('./controllers/collection').set(collectionId, tweetIds, function (error, id) {
    if (error) {

      res.json({
        'error': error
      });

      return;
    }

    res.json({
      id: id
    });
  });

}

function handleGetCollection(req, res) {

  var collectionId;

  if (typeof req.params.collectionId !== 'undefined') {
    collectionId = req.params.collectionId;
  } else {
    console.error('[Snapkite] Missing request data: collectionId');

    res.json({
      error: 'Missing request data'
    });

    return;
  }

  require('./controllers/collection').get(collectionId, function (error, collection) {
    if (error) {

      res.json({
        'error': error
      });

      return;
    }

    if (!collection) {
      res.json({});
      return;
    }

    res.json({
      collectionId: collection.id,
      tweets: collection.tweets
    });
  });

}

// Tweets
router.get('/api/1.0/tweet/:tweetId', handleGetTweet);
router.get('/api/1.0/tweets/all', handleGetTweets);
router.get('/api/1.0/tweets/all/:numberOfTweets', handleGetTweets);
router.get('/api/1.0/tweets/all/:numberOfTweets/:offset', handleGetTweets);
router.get('/api/1.0/tweets/keyword/:keyword', handleGetTweets);
router.get('/api/1.0/tweets/keyword/:keyword/:numberOfTweets', handleGetTweets);
router.get('/api/1.0/tweets/keyword/:keyword/:numberOfTweets/:offset', handleGetTweets);

// Collection
router.post('/api/1.0/collection/', handleSetCollection);
router.get('/api/1.0/collection/:collectionId', handleGetCollection);

app.use(router);
