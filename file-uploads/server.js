// initialize express
const express = require('express');
const app = express();

const multer = require('multer');

// initialize handlebars
const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

//
const port = process.env.port || 3003;

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/uploads/images');
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
	},
});

const upload = multer({ storage: storage });

// create routes
app.get('/', (req, res) => {
	res.type('text/html');
	res.render('page');
});

app.post('/profile', upload.single('avatar'), (req, res) => {
	// req.file is the name of your file in the form above, here 'uploaded_file'
	// req.body will hold the text fields, if there were any
	console.log(req.file, req.body);
	console.log(req.file.originalname);
	console.log(req.file.mimetype);
	res.type('text/html');
	res.send('uploaded!!');
});

// error handling
// not found
app.use((req, res) => {
	res.type('text/html');
	res.status(404);
	res.send('not found');
});
// server error
app.use((err, req, res, next) => {
	res.type('text/html');
	res.status(500);
	res.send('server error');
});

app.listen(port, () => {
	console.log(`server started on http://localhost:${port}\nctrl+c to quit`);
});
