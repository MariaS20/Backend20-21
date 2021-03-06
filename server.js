require('dotenv').config();
const bodyParser = require('body-parser');
const express = require("express");
const app = express();
const PORT = 3000 || process.env.PORT;
const mongo = require('mongodb');
const ejs = require("ejs");
const slug = require("slug");


let collection = null;
const MongoClient = require('mongodb').MongoClient ;
const uri = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@backenddata.9wfwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true
});

// database connection
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
app.get('/loginFailed', checklogin);
app.get('/loginSucces', checklogin);
app.get('/updateProfile', updateform);
app.post('/updateProfile', update);
app.post('/deleteProfile', removeform);
app.delete('/deleteProfile', remove);
app.get('/', renderHome);
app.get('*', notFound);

 
function renderHome(req, res) { //geeft de hoofdpagina login mee
 try {
 res.render('login.ejs');
 } catch (error) {
  console.log("this is the error", error)
}
 };

function form(req, res) {
  res.render('registreren.ejs')
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
};

//checkt de ingegeven username en het wachtwoord met die uit de database 
function checklogin(req, res, next) {
  collection.findOne({ naam: req.body.naam }, done) //zoekt naar de naam in de database zodra deze gevonden is door naar function done


  function done(err, data) {
    if (err) {
      next(err)
    } else {
      if (data.wachtwoord == req.body.wachtwoord) { //als de naam overeenkomt met het wachtwoord dan is de login geslaagd
        console.log('Login geslaagd');
        res.render('loginSucces.ejs')
      } else {
        console.log('Login mislukt'); //zodra deze niet overeenkomen dan is de login mislukt.
        res.render('loginFailed.ejs') //en wordt de pagina loginFailed terug gestuurd

      }
    }
  }
};

function updateform(req, res) {
  try {
  res.render('updateProfile.ejs');
  } catch (error) {
   console.log("this is the error", error)
 }
  };

  function update(req, res, next) {

    collection.updateOne({ naam: req.body.naam }, { $set: { naam: req.body.newUsername } }, done)

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.redirect('/')
        }
    }
};

function removeform(req, res) {
  res.render('deleteProfile.ejs')
};

//werkt momenteel niet
function remove(req) {
  collection.findOne({username : req.body.username})
  .then(user => {
    if(user == null){
      console.log("Niemand gevonden met deze username")
    }
    else {
      user.remove();
    } 
  })
}; 

//shows up when wanted page is not found
function notFound(req, res) {   
  res.status(404).render('404.ejs')
};

app.listen(PORT, () => {
  console.log(`App is running`)
});