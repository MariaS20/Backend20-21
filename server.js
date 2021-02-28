const express = require('express')
const bodyParser = require('body-parser')
const mongo = require('mongodb')
const ejs = require("ejs")
const slug = require("slug")
const port = 8000


require('dotenv').config()


//connect met de database

let db = null
const url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT

mongo.MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
  if (err) {
    throw err
  }
  
  db = client.db(process.env.DB_NAME)
  
})