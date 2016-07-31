"use strict";

let mongo = require('mongodb');
let client = mongo.MongoClient;
let _db;

module.exports = {
  connect() {
    client.connect('mongodb://localhost:27017/olympics-dev',function(err,db){
      if(err){
        console.log("Error connecting to Mongo - check mongod connection");
        process.exit(1);
      }
      _db = db;
      console.log("connected to Mongo");
    });
  },
  sports(){
    return _db.collection('sports');
  }
}
