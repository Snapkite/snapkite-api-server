var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var COLLECTION_NAME = 'collection';

var collectionSchema = new mongoose.Schema({
  id: {type: String, required: true},
  tweets: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }]
}, { collection: COLLECTION_NAME });

module.exports = mongoose.model('Collection', collectionSchema);
