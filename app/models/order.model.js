module.exports = (sequelize, Sequelize) => {

    // Define the models for the two tables
    const Order = sequelize.define('Order', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        totalAmount: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
        },
    }, {
        timestamps: false,
    });

    return Order;
}
