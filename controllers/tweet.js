var Tweet = require('../models/Tweet');

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
      }

      callback(null, tweets);
    });
};

var getKeyword = function (keyword, numberOfTweets, offset, callback) {

  Tweet
    .find({'text': { '$regex': keyword, '$options': 'i'}})
    .skip(offset)
    .sort({'id': -1})
    .limit(numberOfTweets)
    .exec(function (error, tweets) {
      if (error) {
        console.error('[Snapkite] Failed to get tweets: ' + error);
        callback(error, null);
      }

      callback(null, tweets);
    });
};

module.exports = {
  getAll: getAll,
  getKeyword: getKeyword
};
