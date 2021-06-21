"use strict";

const express = require('express')
const app = express()
const port = 2800

app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
