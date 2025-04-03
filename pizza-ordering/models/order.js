const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as necessary
const Customer = require('./customer');

class Order extends Model {}

Order.init(
	{
		size: {
			type: DataTypes.ENUM('S', 'M', 'L', 'XL'),
			allowNull: false,
		},
		toppings: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		notes: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		status: {
			type: DataTypes.ENUM('New', 'Processing', 'Completed'),
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Order',
	}
);

// Define associations
Order.belongsTo(Customer);
Customer.hasMany(Order);

module.exports = Order;
