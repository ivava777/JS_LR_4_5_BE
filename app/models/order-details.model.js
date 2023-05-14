module.exports = (sequelize, Sequelize) => {

    const OrderDetails = sequelize.define('OrderDetails', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        price: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                isDecimal: true,
                min: 0,
            },
        }
    }, {
        timestamps: false,
    });

    return OrderDetails;
}




