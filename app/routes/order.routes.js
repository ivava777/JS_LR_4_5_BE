const items = require("../controllers/item.controller");
const orders = require("../controllers/order.controller");
module.exports = app => {
  const orders = require("../controllers/order.controller.js");

  const router = require("express").Router();

  router.post("/", orders.create);

  router.get("/", orders.findAll);

  router.get("/:id", orders.findOne);

  router.delete("/:id", orders.delete);

  app.use('/api/orders', router);
};
