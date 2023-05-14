module.exports = (sequelize, Sequelize) => {
  const Item = sequelize.define("item", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    available: {
      type: Sequelize.BOOLEAN
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

  return Item;
};
