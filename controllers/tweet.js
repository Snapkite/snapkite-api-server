var Tweet = require('../models/Tweet');

var get = function (tweetId, callback) {

  Tweet
    .findOne({'id': tweetId}, function (error, tweet) {
      if (error) {
        console.error('[Snapkite] Failed to get tweet: ' + error);
        callback(error, null);
        return;
      }

      callback(null, tweet);
    });
};

var getAll = function (numberOfTweets, offset, callback) {

  Tweet
    .find()
    .skip(offset)
    .sort({'id': -1})
    .limit(numberOfTweets)
    .exec(function (error, tweets) {
      if (error) {
        console.error('[Snapkite] Failed to get tweets: ' + error);
        callback(error, null);
        return;
      }

      callback(null, tweets);
    });
};

var getKeyword = function (keyword, numberOfTweets, offset, callback) {

  var regex = new RegExp('\\b' + keyword + '\\b', 'i');

  Tweet
    .find({'text': { '$regex': regex }})
    .skip(offset)
    .sort({'id': -1})
    .limit(numberOfTweets)
    .exec(function (error, tweets) {
      if (error) {
        console.error('[Snapkite] Failed to get tweets: ' + error);
        callback(error, null);
        return;
      }

      callback(null, tweets);
    });
};

var getIds = function (ids, callback) {

  Tweet
    .find({'id': {
      $in: ids
    }})
    .exec(function (error, tweets) {
      if (error) {
        console.error('[Snapkite] Failed to get tweets: ' + error);
        callback(error, null);
        return;
      }

      callback(null, tweets);
    });
};

module.exports = {
  get: get,
  getAll: getAll,
  getKeyword: getKeyword,
  getIds: getIds
};
