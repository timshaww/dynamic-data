const express = require('express');
const app = express();
const sequelize = require('./config/database');
const methodOverride = require('method-override');
const moment = require('moment');

// Models
const Customer = require('./models/customer');
const Order = require('./models/order');

// Configure Express
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Add method-override middleware
app.use(methodOverride('_method'));

// Configure Handlebars
const handlebars = require('express-handlebars');
app.engine(
	'handlebars',
	handlebars.engine({
		helpers: {
			eq: function (a, b) {
				return a === b;
			},
			formatDate: function (date) {
				return moment(date).format('MM/DD/YYYY');
			},
		},
	})
);
app.set('view engine', 'handlebars');

const port = process.env.PORT || 3008;

// Initialize database
sequelize
	.sync()
	.then(() => {
		console.log('Database synced');
	})
	.catch((err) => {
		console.error('Error syncing database:', err);
	});

// Home route
app.get('/', (req, res) => {
	res.render('home');
});

// ********** CUSTOMER ROUTES **********

// List all customers
app.get('/customers', async (req, res) => {
	try {
		await Customer.findAll({
			raw: true, // This returns plain JavaScript objects instead of Sequelize model instances
		}).then((customers) => {
			console.log('--------------');
			console.log(customers);
			res.render('customers', { customers });
		});
	} catch (err) {
		console.error('Error fetching customers:', err);
		res.status(500).send('Error fetching customers');
	}
});

// Display new customer form
app.get('/customers/new', (req, res) => {
	res.render('customer-form');
});

// Create new customer
app.post('/customers', async (req, res) => {
	try {
		await Customer.create(req.body);
		res.redirect('/customers');
	} catch (err) {
		console.error('Error creating customer:', err);
		res.status(500).send('Error creating customer');
	}
});

// Display single customer
app.get('/customers/:id', async (req, res) => {
	try {
		const customer = await Customer.findByPk(req.params.id, {
			include: [Order],
			raw: true,
		});
		const orders = await Order.findAll({
			where: { CustomerId: req.params.id },
			raw: true,
		});

		if (!customer) {
			return res.status(404).send('Customer not found');
		}

		res.render('customer-detail', { customer, orders });
	} catch (err) {
		console.error('Error fetching customer:', err);
		res.status(500).send('Error fetching customer');
	}
});

// Display edit customer form
app.get('/customers/:id/edit', async (req, res) => {
	try {
		const customer = await Customer.findByPk(req.params.id, {
			raw: true,
		});

		if (!customer) {
			return res.status(404).send('Customer not found');
		}

		res.render('customer-form', { customer });
	} catch (err) {
		console.error('Error fetching customer for edit:', err);
		res.status(500).send('Error fetching customer');
	}
});

// Update customer
app.put('/customers/:id', async (req, res) => {
	try {
		const customer = await Customer.findByPk(req.params.id);

		if (!customer) {
			return res.status(404).send('Customer not found');
		}

		await customer.update(req.body);
		res.redirect('/customers/' + req.params.id);
	} catch (err) {
		console.error('Error updating customer:', err);
		res.status(500).send('Error updating customer');
	}
});

// Delete customer
app.delete('/customers/:id', async (req, res) => {
	try {
		const customer = await Customer.findByPk(req.params.id);

		if (!customer) {
			return res.status(404).send('Customer not found');
		}

		await customer.destroy();
		res.redirect('/customers');
	} catch (err) {
		console.error('Error deleting customer:', err);
		res.status(500).send('Error deleting customer');
	}
});

// ********** ORDER ROUTES **********

// List all orders
app.get('/orders', async (req, res) => {
	try {
		const orders = await Order.findAll({
			include: Customer,
			order: [['updatedAt', 'DESC']],
			raw: true,
		});
		console.log(orders);

		// Debug: log the first order to see its structure
		if (orders.length > 0) {
			console.log('First order structure:', JSON.stringify(orders[0], null, 2));
		}
		res.render('orders', { orders });
	} catch (err) {
		console.error('Error fetching orders:', err);
		res.status(500).send('Error fetching orders');
	}
});

// Display new order form
app.get('/orders/new', async (req, res) => {
	try {
		const customers = await Customer.findAll({
			raw: true,
		});
		const selectedCustomerId = req.query.customerId ? parseInt(req.query.customerId) : null;

		res.render('order-form', {
			customers,
			selectedCustomerId,
		});
	} catch (err) {
		console.error('Error preparing new order form:', err);
		res.status(500).send('Error loading order form');
	}
});

// Create new order
app.post('/orders', async (req, res) => {
	try {
		const { customerId, ...orderData } = req.body;

		// Validate customerId
		const customer = await Customer.findByPk(customerId);
		if (!customer) {
			return res.status(400).send('Invalid customer ID');
		}

		// Create order with associated customer
		await Order.create({ ...orderData, CustomerId: customerId });
		res.redirect('/orders');
	} catch (err) {
		console.error('Error creating order:', err);
		res.status(500).send('Error creating order');
	}
});

// Display single order
app.get('/orders/:id', async (req, res) => {
	try {
		const order = await Order.findByPk(req.params.id, {
			include: Customer,
			raw: true,
		});

		if (!order) {
			return res.status(404).send('Order not found');
		}

		res.render('order-detail', { order });
	} catch (err) {
		console.error('Error fetching order:', err);
		res.status(500).send('Error fetching order');
	}
});

// Display edit order form
app.get('/orders/:id/edit', async (req, res) => {
	try {
		const order = await Order.findByPk(req.params.id, {
			raw: true,
		});
		const customers = await Customer.findAll({
			raw: true,
		});

		if (!order) {
			return res.status(404).send('Order not found');
		}

		res.render('order-form', { order, customers });
	} catch (err) {
		console.error('Error fetching order for edit:', err);
		res.status(500).send('Error fetching order');
	}
});

// Update order
app.put('/orders/:id', async (req, res) => {
	try {
		const order = await Order.findByPk(req.params.id);

		if (!order) {
			return res.status(404).send('Order not found');
		}

		await order.update(req.body);
		res.redirect('/orders/' + req.params.id);
	} catch (err) {
		console.error('Error updating order:', err);
		res.status(500).send('Error updating order. \n\n', err);
	}
});

// Update order status only
app.put('/orders/:id/status', async (req, res) => {
	try {
		const order = await Order.findByPk(req.params.id);

		if (!order) {
			return res.status(404).send('Order not found');
		}

		await order.update({ status: req.body.status });
		res.redirect('/orders/' + req.params.id);
	} catch (err) {
		console.error('\n\nError updating order status:', err);
		res.status(500).send('Error updating order status: \n\n', err);
	}
});

// Delete order
app.delete('/orders/:id', async (req, res) => {
	try {
		const order = await Order.findByPk(req.params.id);

		if (!order) {
			return res.status(404).send('Order not found');
		}

		await order.destroy();
		res.redirect('/orders');
	} catch (err) {
		console.error('Error deleting order:', err);
		res.status(500).send('Error deleting order');
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
