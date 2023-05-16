module.exports = (sequelize, Sequelize) => {
    const Pack = sequelize.define("pack", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        pack_id: {
            type: Sequelize.INTEGER
        },
        product_id: {
            type: Sequelize.INTEGER
        },
        qty: {
            type: Sequelize.INTEGER
        }
    }, {
        timestamps: false
    });
  
    return Pack;
};