const fs = require('fs');
const express = require('express');
const multer = require('multer');
const Papa = require('papaparse');
const cors = require('cors');

const upload = multer({ dest: 'tmp/' });

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors())

const db = require("./models");
db.sequelize.sync();

async function validateCsv(csvData) {
    const errors = [];
    await Promise.all(
        csvData.map(async (product, index) => {
            if ((!product.product_code)) {
                errors.push({
                    lineNumber: index + 2,
                    data: product,
                    errors: 'Não contém product_code.'
                });
                return;
            }

            if ((!product.new_price)) {
                errors.push({
                    lineNumber: index + 2,
                    data: product,
                    errors: 'Não contém new_price.'
                });
                return;
            }

            const newPrice = parseFloat(product.new_price);

            if (!newPrice) {
                errors.push({
                    lineNumber: index + 2,
                    data: product,
                    errors: `O novo valor de venda do produto #${product.product_code} não é um número válido.`
                });
            }

            const productEntry = await db.products.findOne({ where: { code: product.product_code } });

            if (!productEntry) {
                errors.push({
                    lineNumber: index + 2,
                    data: product,
                    errors: `Produto #${product.product_code} não existe na base de dados.`
                });
                return;
            }

            if (Math.abs((newPrice / productEntry.sales_price) - 1) > 0.1) {
                errors.push({
                    lineNumber: index + 2,
                    data: product,
                    errors: `Alteração de valor de venda do produto #${product.product_code} é maior que 10%. Valor de venda atual: ${productEntry.sales_price}`
                });
            }

            if (newPrice < productEntry.cost_price) {
                errors.push({
                    lineNumber: index + 2,
                    data: product,
                    errors: `Valor de venda do produto #${product.product_code} não pode estar abaixo do valor de custo. Valor de custo: ${productEntry.cost_price}`
                });
            }

            const packsContainingProduct = await db.packs.findAll({ where: { product_id: product.product_code } });

            if (packsContainingProduct.length > 0) {
                const packsWithoutPriceChange = packsContainingProduct.filter(
                    pack => !csvData.some(prod => prod.product_code === pack.pack_id))
                if (packsWithoutPriceChange.length > 0) {
                    const packIds = packsWithoutPriceChange.map(pack => pack.pack_id);
                    errors.push({
                        lineNumber: index + 2,
                        data: product,
                        errors: `Os seguintes pacotes que contém o produto #${product.product_code} não possuem alteração de preço: ${packIds.join(', ')}.`
                    });
                }
            }
        })
    );

    return errors;
}

async function updateProducts(csvData) {
    return Promise.all(
        csvData.map(async product => {
            const productEntry = await db.products.findOne(
                { where: { code: product.product_code } }
            );
            productEntry.sales_price = parseFloat(product.new_price);
            return productEntry;
        })
    );
}

app.post('/validate-csv', upload.single('file'), function (req, res) {
    let csvData;
    const csvFile = fs.createReadStream(req.file.path,'utf8');

    csvFile.on("data", data => {
        csvData = Papa.parse(data, { header: true });
    });
    csvFile.on("end", async () => res.send(await validateCsv(csvData.data)));
});

app.post('/upload-csv', upload.single('file'), function (req, res) {
    let csvData;
    const csvFile = fs.createReadStream(req.file.path,'utf8');

    csvFile.on("data", data => {
        csvData = Papa.parse(data, { header: true });
    });
    csvFile.on("end", async () => {
        const errors = await validateCsv(csvData.data);
        if (errors.length > 0) {
            res.status(422);
            res.send(errors);
            return;
        }
        
        const updatedProducts = await updateProducts(csvData.data);
        res.send(updatedProducts);
    });
});

app.post('/create-product', async (req, res) => {
    const newProduct = await db.products.create(req.body);
    res.send(newProduct);
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});