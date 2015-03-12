var shortId = require('shortid');
var tweetController = require('./tweet');
var Collection = require('../models/Collection');

var get = function (id, callback) {

  Collection
    .findOne({id: id})
    .populate('tweets')
    .exec(function (error, collection) {
      if (error) {
        console.error('[Snapkite] Failed to get collection: ' + error);
        callback(error, null);
        return;
      }

      callback(null, collection);
    });
};

var set = function (collectionId, tweetIds, callback) {

  tweetController.getIds(tweetIds, function (error, tweets) {
    if (error) {
      console.error('[Snapkite] Failed to save collection: ' + error);
      callback(error);
      return;
    }

    console.log('[Snapkite] Got tweets');

    var tweetObjectIds = tweets.map(function (collectionTweet) {
      return collectionTweet._id;
    });

    if (collectionId) {

      // Update existing collection
      console.log('[Snapkite] Update existing collection');

      Collection.update({id: collectionId}, {$set: {tweets: tweetObjectIds}}, function (error) {
        if (error) {
          console.error('[Snapkite] Failed to update collection: ' + error);
          callback(error);
          return;
        }

        callback(null, collectionId);
      });

    } else {

      // Create new collection
      console.log('[Snapkite] Create new collection');

      var collection = new Collection({
        id: shortId.generate(),
        tweets: tweetObjectIds
      });

      collection.save(function (error, collection) {
        if (error) {
          console.error('[Snapkite] Failed to save collection: ' + error);
          callback(error);
          return;
        }

        callback(null, collection.id);
      });

    }
  });
};

module.exports = {
  get: get,
  set: set
};
