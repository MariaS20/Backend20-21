require('dotenv').config();
const bodyParser = require('body-parser');
const express = require("express");
const app = express();
const PORT = 3000 || process.env.PORT;
const mongo = require('mongodb');
const ejs = require("ejs");
const slug = require("slug");
// const port = 3000;

let db = null;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@backenddata.9wfwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true
});

// database connect
client.connect(function (err, client) {
  if (err) {
    throw err
  }
  collection = client.db("Datingwebsite").collection("users");
});

//routes 
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));  //to support url encoded bodies
app.set('view engine', 'ejs');
app.set('views', 'view');
app.post('/', register);
app.post('/login', checklogin);
app.get('/registreren', form);
app.get('/login', loginform);
app.get('/loginFailed', checklogin);
app.get('/loginSucces', checklogin);
app.get('/', renderHome);
// app.get('/', datingWebsite)
//   // .get('/:id', user)


 
const persons = [
 {
 name: 'Tess',
 wachtwoord: 'Uithoorn'
 },
 {
 name: 'Piet',
 wachtwoord: 'amstelveen'
 }
];
 
function renderHome(req, res) {
 try {
 res.render('login.ejs', {data: persons});
 } catch (error) {
 
 }
};
 
app.listen(PORT, () => {
 console.log('app running on port', PORT);
});
  
// function datingWebsite(req, res, next) {
//   res.render('login.ejs', { data: persons })
// };

function loginform(req, res) {
  try {
    res.render('login.ejs')
  } catch (error) {
    console.log("this is the error", error)
  }
};

function form(req, res) {
  res.render('registreren.ejs')
};

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

function register(req, res, next) {
  collection.insertOne({
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
}



// app.get('/', (req, res) => {
//   res.send('Test 1 Test 2 test??? test')
// })

// app.listen(PORT, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })