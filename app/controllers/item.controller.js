const db = require("../models");
const Item = db.items;
const Op = db.Sequelize.Op;

// Create and Save a new Item
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a item
  const item = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    available: !!req.body?.available,
  };

  // Save Item in the database
  Item.create(item)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Item."
      });
    });
};

// Retrieve all Items from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Item.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving items."
      });
    });
};

// Find a single Item with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Item.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Item with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Item with id=" + id
      });
    });
};

// Update a Item by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Item.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Item was updated successfully."
        });
      } else {
        console.log(`Cannot update Item with id=${id}. Maybe Item was not found or req.body is empty!\n${req}`);
        res.send({
          message: `Cannot update Item with id=${id}. Maybe Item was not found or req.body is empty!\n${req}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Item with id=" + id
      });
    });
};

// Delete a Item with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Item.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Item was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Item with id=${id}. Maybe Item was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// find all available items
exports.findAllAvailable = (req, res) => {
  Item.findAll({ where: { available: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving items."
      });
    });
};
