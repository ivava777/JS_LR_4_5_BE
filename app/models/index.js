const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.items = require("./item.model.js")(sequelize, Sequelize);
db.orders = require("./order.model.js")(sequelize, Sequelize);
db.order_details = require("./order-details.model.js")(sequelize, Sequelize);

const Order = db.orders;
const OrderDetails = db.order_details;
const Item = db.items;

Order.hasMany(OrderDetails, { foreignKey: 'OrderId' });

OrderDetails.belongsTo(Item, { foreignKey: 'itemId' });

module.exports = db;
