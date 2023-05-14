const fs = require('fs');
const express = require('express')
const multer = require('multer')
const Papa = require('papaparse')

const upload = multer({ dest: 'tmp/' });

const app = express()
const port = 8080

const db = require("./models");
db.sequelize.sync();

async function validateCsv(csvData) {
  const errors = [];
  await Promise.all(
      csvData.map(async (product, index) => {
          if ((!product.product_code)) {
              errors.push({
                  lineNumber: index + 1,
                  data: product,
                  errors: 'Não contém product_code.'
              });
              return;
          }

          if ((!product.new_price)) {
              errors.push({
                  lineNumber: index + 1,
                  data: product,
                  errors: 'Não contém new_price.'
              });
              return;
          }

          const newPrice = parseFloat(product.new_price);

          if (!newPrice) {
              errors.push({
                  lineNumber: index + 1,
                  data: product,
                  errors: 'O preço não é um número válido.'
              });
              return;
          }

          const productEntry = await db.products.findOne({ where: { productCode: product.product_code } });

          if (!productEntry) {
              errors.push({
                  lineNumber: index + 1,
                  data: product,
                  errors: `Produto #${product.product_code} não existe na base de dados.`
              });
              return;
          }

          if (Math.abs((newPrice / productEntry.price) - 1) > 0.1) {
              errors.push({
                  lineNumber: index + 1,
                  data: product,
                  errors: 'Alteração do valor está acima de 10%.'
              });
              return;
          }
      })
  );

  return errors;
}

app.post('/validate-csv', upload.single('file'), function (req, res) {
  let csvData;
  const csvFile = fs.createReadStream(req.file.path,'utf8');

  csvFile.on("data", data => {
      csvData = Papa.parse(data, { header: true });
  });
  csvFile.on("end", async () => res.send(await validateCsv(csvData.data)));
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})