const express = require('express')
const app = express()
const port = 3000


require('dotenv').config()


app.get('/', function (req, res) {
    res.send('Test test testtt en nog eens test en test eeeeen test !')
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })