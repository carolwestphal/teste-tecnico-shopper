const fs = require('fs');
const express = require('express')
const multer = require('multer');
const csv = require('fast-csv');

const upload = multer({ dest: 'tmp/' });

const app = express()
const port = 8080

const db = require("./models");
db.sequelize.sync();

app.post('/check-file', upload.single('file'), function (req, res) {
    const fileRows = [];
  
    csv.fromPath(req.file.path)
      .on("data", function (data) {
        fileRows.push(data);
      })
      .on("end", function () {
        console.log(fileRows)
        fs.unlinkSync(req.file.path);
      })
  });

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})