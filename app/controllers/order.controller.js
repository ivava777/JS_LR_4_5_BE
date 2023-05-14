const sql = require("../config/db.sql");
const db = require("../models");
const Order = db.orders;
const OrderDetails = db.order_details;


// Create a controller function to insert order and order details
exports.create = async (req, res) => {
  const { totalAmount, orderDetails } = req.body; // Get the order and order details data from the request body

  try {
    // Start a transaction to ensure data consistency across tables
    const transaction = await Order.sequelize.transaction();

    // Create the order
    const order = await Order.create(
        { totalAmount },
        { transaction }
    );

    // Create the order details associated with the order
    await OrderDetails.bulkCreate(
        orderDetails.map((detail) => ({
          ...detail,
          OrderId: order.id,
        })),
        { transaction }
    );

    // Commit the transaction if everything is successful
    await transaction.commit();

    res.status(200).json({ message: 'Order created successfully', data: order });
  } catch (error) {
    // Rollback the transaction if an error occurs
    await transaction.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Retrieve all Orders from the database.
exports.findAll = async (req, res) => {
  try {
    // Retrieve all orders with associated order details
    const orders = await Order.findAll({
      include: OrderDetails, // Include the OrderDetails model
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

// Find a single Order with an id
exports.findOne = async (req, res) => {
  const orderId = req.params.id; // Get the order ID from the request parameters

  findById(orderId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Order with id ${orderId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Order with id " + orderId
        });
      }
    } else res.send(data);
  });
  // try {
  //   // Find the order by ID
  //   const order = await Order.findByPk(orderId);
  //
  //   if (order) {
  //     res.status(200).json(order);
  //   } else {
  //     res.status(404).json({ error: 'Order not found' });
  //   }
  // } catch (error) {
  //   console.error('Error retrieving order:', error);
  //   res.status(500).json({ error: 'Failed to retrieve order' });
  // }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Order.destroy({
    where: { id: id }
  })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Order was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Order with id=${id}. Maybe order was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Order with id=" + id
        });
      });
};

function findById(item_id, result) {
  sql.query(`SELECT orders.id as orderId,
             orders.date as date,
             orders.totalAmount as totalAmount,
             orderdetails.itemId as itemId,
             orderdetails.quantity as quantity,
             orderdetails.price as price,
             items.name as name  
             FROM orders 
             JOIN orderdetails ON orders.id = orderdetails.OrderId 
             JOIN items ON orderdetails.itemId = items.id 
             WHERE orders.id = ${item_id}`,
      (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found order: ", res[0]);
      result(null, {orderId: res[0].orderId, date: res[0].date, totalAmount: res[0].totalAmount,
        orderDetails: res.map(item => ({itemId: item.itemId, quantity: item.quantity, price: item.price, name: item.name}))});
      return;
    }

    // not found Item with the id
    result({ kind: "not_found" }, null);
  });
};

