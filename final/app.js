const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const { Sequelize, Model, DataTypes } = require('sequelize');
const moment = require('moment');

const app = express();

// Create a sequelize instance
const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './database.sqlite',
	logging: false,
});

// Define List model
const List = sequelize.define('List', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	createdAt: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW,
	},
	updatedAt: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW,
	},
});

// Define TodoItem model
const TodoItem = sequelize.define('TodoItem', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	completed: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	dueDate: {
		type: DataTypes.DATE,
		allowNull: true,
	},
	createdAt: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW,
	},
	updatedAt: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW,
	},
});

// Set up associations
List.hasMany(TodoItem, {
	foreignKey: 'listId',
	onDelete: 'CASCADE',
});
TodoItem.belongsTo(List, {
	foreignKey: 'listId',
});

// Set up Handlebars
app.engine(
	'handlebars',
	handlebars.engine({
		helpers: {
			formatDate: function (date) {
				if (!date || date === 'Invalid Date') {
					return null;
				}
				return moment(date).format('MMM D, YYYY');
			},
		},
	})
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// Home routes
app.get('/', async (req, res) => {
	try {
		const latestLists = await List.findAll({
			raw: true,
		});

		res.render('home', {
			title: 'Task Manager Dashboard',
			latestLists,
		});
	} catch (error) {
		console.error('Error fetching latest lists:', error);
		res.status(500).send('Internal Server Error');
	}
});

// Lists routes
app.get('/lists', async (req, res) => {
	try {
		const lists = await List.findAll({
			include: [
				{
					model: TodoItem,
					as: 'TodoItems',
				},
			],
		});

		const formattedLists = lists.map((list) => list.get({ plain: true }));

		res.render('lists/index', {
			title: 'All Lists',
			lists: formattedLists,
		});
	} catch (error) {
		console.error('Error fetching lists:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/lists/:id', async (req, res) => {
	try {
		const list = await List.findByPk(req.params.id, {
			include: [
				{
					model: TodoItem,
					as: 'TodoItems',
				},
			],
		});

		if (!list) {
			return res.status(404).send('List not found');
		}

		const listData = list.get({ plain: true });
		const todoItems = listData.TodoItems || [];

		res.render('lists/show', {
			title: list.title,
			list: listData,
			todoItems,
		});
	} catch (error) {
		console.error('Error fetching list:', error);
		res.status(500).send('Internal Server Error');
	}
});

// Admin routes
app.get('/admin', async (req, res) => {
	try {
		const lists = await List.findAll({
			raw: true,
		});
		const allTasks = await TodoItem.findAll({
			raw: true,
		});
		res.render('admin/index', {
			title: 'Admin Dashboard',
			lists,
			allTasks,
		});
	} catch (error) {
		console.error('Error fetching lists:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.post('/admin/lists', async (req, res) => {
	try {
		const { title, description } = req.body;
		await List.create({ title, description });
		res.redirect('/admin');
	} catch (error) {
		console.error('Error creating list:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.delete('/admin/lists/:id', async (req, res) => {
	try {
		await List.destroy({ where: { id: req.params.id } });
		res.redirect('/admin');
	} catch (error) {
		console.error('Error deleting list:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.put('/admin/lists/:id', async (req, res) => {
	try {
		const { title, description } = req.body;
		await List.update({ title, description }, { where: { id: req.params.id } });
		res.redirect('/admin');
	} catch (error) {
		console.error('Error updating list:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.post('/admin/lists/:listId/todos', async (req, res) => {
	try {
		const { title, description, dueDate } = req.body;
		await TodoItem.create({
			title,
			description,
			dueDate: dueDate ? new Date(dueDate) : null,
			listId: req.params.listId,
		});
		res.redirect(`/lists/${req.params.listId}`);
	} catch (error) {
		console.error('Error creating todo item:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.delete('/admin/todos/:id', async (req, res) => {
	try {
		const todo = await TodoItem.findByPk(req.params.id);
		if (!todo) {
			return res.status(404).send('Todo item not found');
		}
		await todo.destroy();
		res.redirect(req.headers.referer || '/admin');
	} catch (error) {
		console.error('Error deleting todo item:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.put('/admin/todos/:id', async (req, res) => {
	try {
		const todo = await TodoItem.findByPk(req.params.id);
		if (!todo) {
			return res.status(404).send('Todo item not found');
		}

		const { title, description, dueDate, completed } = req.body;
		await todo.update({
			title,
			description,
			dueDate: dueDate ? new Date(dueDate) : null,
			completed: completed === 'on',
		});

		res.redirect(req.headers.referer || '/admin');
	} catch (error) {
		console.error('Error updating todo item:', error);
		res.status(500).send('Internal Server Error');
	}
});

// Sync database and start server
const PORT = process.env.PORT || 3009;
sequelize
	.sync()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error('Unable to sync database:', err);
	});
