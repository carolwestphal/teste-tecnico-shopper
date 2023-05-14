module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
        productCode: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.FLOAT
        },
      
    });
  
    return Product;
  };    