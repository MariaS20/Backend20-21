const express = require("express");
const server = express();
const bodyParser = require('body-parser');
// const mongo = require('mongodb');
const ejs = require("ejs");
const slug = require("slug");
const app = express();
const port = 3000;
// require('dotenv').config();

let collection = null;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@backenddata.9wfwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true
});

//database connect
client.connect(function (err, client) {
  if (err) {
    throw err
  }
  collection = client.db("users").collection("Datingwebsite");
})

//routes
express()
  .use(express.static('static'))
  .use(bodyParser.urlencoded({ extended: true }))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', Datingwebsite)
  .post('/', add)
  .post('/login', checklogin)
  .get('/registreren', form)
  .get('/login', loginform)
  // .get('/:id', user)
  .get('/loginFailed', checklogin)
  .get('/loginSucces', checklogin)
  .use(notFound)
  .listen(3000);



function Datingwebsite(req, res, next) {
  db.collection('users').find().toArray(done)

  function done(err, data) {
    if (err) {
      next(err)
    } else {
      res.render('login.ejs', { data: data })
    }
  }
};

function loginform(req, res) {
  res.render('login.ejs')
};

function form(req, res) {
  res.render('registreren.ejs')
};

db.initialize(dbName, collectionName, function(dbCollection) { // successCallback
  dbCollection.insertOne({
     naam: req.body.naam,
     email: req.body.email,
     wachtwoord: req.body.wachtwoord
   }, done)
 
}, function(err) { // failureCallback
 throw (err);
});



//checkt de ingegeven username en het wachtwoord met die uit de database 
function checklogin(req, res, next) {
  db.collection('users').findOne({ naam: req.body.naam }, done)


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