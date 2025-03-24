// https://expressjs.com/
const express = require('express');
const app = express();

// Setup static routing
app.use(express.static('./public'));

// This processes the incoming request bodies before they reach the handlers.
// It is used to extract data from the request body and make it available in the req.body property.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes handlers
const handler = require('./lib/handler');

//Setup the template engine handlebars
const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

// To set the port execute: port=8080 node miami
const port = process.env.port || 3007;

// Import necessary files
let nav = require('./data/navigation.json');
let slideshow = require('./data/slideshow.json');
let gallery = require('./data/gallery.json');
let content = require('./data/pages.json');
let destinations = require('./data/destination.json');

// Routes
app.get('/', (req, res) => {
	let slides = slideshow.slides.filter((slide) => {
		return slide.home === true;
	});

	res.type('text/html');
	res.render('page', {
		title: 'Exumas Travel Guide',
		description:
			'Discover the best places to visit in the Exumas. From the famous swimming pigs to the stunning Thunderball Grotto, this guide has everything you need to know about the Exumas.',
		nav: nav,
		slides: slides,
		images: gallery.images,
		isHomePage: true,
	});
});

app.get('/page/:page', (request, response) => {
	let page = content.pages.filter((item) => {
		return item.page === request.params.page;
	});

	let slides = slideshow.slides.filter((slides) => {
		return slides.page === request.params.page;
	});

	let locations = destinations.locations.filter((loc) => {
		return loc.page === request.params.page;
	});

	response.type('text/html');
	response.render('page', {
		title: page[0].title,
		description: page[0].description,
		locations,
		nav: nav,
		slides: slides,
		images: gallery.images,
	});
});

// Query, params and body
app.get('/search', (req, res) => {
	res.type('text/html');
	res.render('page', { title: 'Search results for: ' + req.query.q, nav });
});

//Basic GET form
app.get('/basic', (req, res) => {
	res.render('page', { req });
});

//Newsletter Routes
app.get('/newsletter-signup', handler.newsletterSignup);
app.post('/newsletter-signup/process', handler.newsletterSignupProcess);
app.get('/newsletter/list', handler.newsletterSignupList);
app.get('/newsletter/detail/:email', handler.newsletterUser);
app.get('/newsletter/delete/:email', handler.newsletterDelete);

// Not found
app.use((req, res) => {
	res.type('text/html');
	res.status(404);
	res.send('404 not found');
});

//Server Error
app.use((err, req, res, next) => {
	console.log('----------Server Error----------\n', err);
	res.type('text/html');
	res.status(500);
	res.send('500 server error');
});

// Start the server
app.listen(port, () => {
	console.log(`Express is running on http://localhost:${port};`);
	console.log(`Press Ctrl-C to terminate.`);
});
