var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://ENgineer:enen@ds063240.mongolab.com:63240/weng_e';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  console.log("Connected correctly to server");

  findDocuments(db, function(docs){
  	console.log(docs);
  	db.close();
  });

  
});

function findDocuments(db, callback) {
  // Get the documents collection
  var collection = db.collection('terms');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    callback(docs);
  }); 
}