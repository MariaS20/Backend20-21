const express = require("express");
const server = express();
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const ejs = require("ejs");
const slug = require("slug");
require('dotenv').config();
const app = express();
const port = 8000;

// mongodb driver
const MongoClient = require("mongodb").MongoClient;

const dbConnectionUrl = "mongodb+srv://dbTess:neverAgain@backenddata.9wfwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

function initialize(
    dbName,
    dbCollectionName,
    successCallback,
    failureCallback
) {
    MongoClient.connect(dbConnectionUrl, function(err, dbInstance) {
        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`);
            failureCallback(err); // this should be "caught" by the calling function
        } else {
            const dbObject = dbInstance.db(dbName);
            const dbCollection = dbObject.collection(dbCollectionName);
            console.log("[MongoDB connection] SUCCESS");

            successCallback(dbCollection);
        }
    });
}

module.exports = {
    initialize
};


const body_parser = require("body-parser");

// parse JSON (application/json content-type)
server.use(body_parser.json());



// db setup
const db = require("./server.js")
const dbName = "DatingWebsite";
const collectionName = "users";


server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});

db.initialize(dbName, collectionName, function(dbCollection) { // successCallback
  // get all items
  dbCollection.find().toArray(function(err, result) {
      if (err) throw err;
        console.log(result);
  });

  // << db CRUD routes >>

}, function(err) { // failureCallback
  throw (err);
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})