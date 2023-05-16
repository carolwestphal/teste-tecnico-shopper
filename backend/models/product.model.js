module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
        code: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        },
        cost_price: {
            type: Sequelize.FLOAT
        },
        sales_price: {
            type: Sequelize.FLOAT
        }
    }, {
        timestamps: false
    });
  
    return Product;
};