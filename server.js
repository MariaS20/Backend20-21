const express = require("express");
const server = express();
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const ejs = require("ejs");
const slug = require("slug");
const app = express();
const port = 3000;
require('dotenv').config();

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


// server.listen(port, () => {
//   console.log(`Server listening at ${port}`);
// });

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

// db = client.db(process.env.DB_NAME)

express()
  .use(express.static('static'))
  .use(bodyParser.urlencoded({extended: true}))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', DatingWebsite)
  .post('/', add)
  .post('/login', checklogin)
  .get('/registreren', form)
  .get('/login', loginform)
  // .get('/:id', user)
  .get('/loginFailed', checklogin)
  .get('/loginSucces', checklogin)
  .use(notFound)
  .listen(3000);



  function DatingWebsite(req, res, next) {
    db.collection('users').find().toArray(done)
  
    function done(err, data) {
      if (err) {
        next(err)
      } else {
        res.render('login.ejs', {data: data})
      }
    }
  };

  function loginform(req, res) {
    res.render('login.ejs')
  };
  
  function form(req, res) {
    res.render('registreren.ejs')
  };
  
  
  function add(req, res, next) {
    db.collection('users').insertOne({
      naam: req.body.naam,
      email: req.body.email,
      wachtwoord: req.body.wachtwoord
    }, done)
  
    function done(err, data) {
      if (err) {
        next(err)
      } else {
        res.redirect('/')
      }
    }
  };
  
  //checkt de ingegeven username en het wachtwoord met die uit de database 
  function checklogin(req, res, next) {
    db.collection('users').findOne({naam:req.body.naam}, done) 
  
  
    function done(err, data) {
      if (err) {
        next(err)
      } else {
        if (data.wachtwoord == req.body.wachtwoord) {
          console.log('Login geslaagd'); 
          res.render('loginSucces.ejs')
        } else {
          console.log('Login mislukt');
          res.render('loginFailed.ejs')
    
        }
      }
    }
  };
  
  
  //dealt met not found pages
  function notFound(req, res) {
    res.status(404).render('404.ejs')
  };

// app.get('/', (req, res) => {
//   res.send('Test 1 Test 2 test??? test')
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })