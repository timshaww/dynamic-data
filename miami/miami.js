const express = require('express');

const app = express();

const port = process.env.port || 8080;

// routes
app.get('/', (req, res) => {
    res.type('text/html');
    res.send('Home Page');
})
app.get('/beaches', (req, res) => {
    res.type('text/html');
    res.send('Night Life');
})
app.get('/nightlife', (req, res) => {
    res.type('text/html');
    res.send('Beaches');
})
app.get('/about', (req, res) => {
    response.type('text/html');
    response.send('About');
})

// page not found
app.use((req, res) => {
    res.type('text/html');
    res.status(404);
    res.send('404 - Not Found');
})

// server error
app.use((err, req, res, next) => {
    console.error(err.message)
    res.type('text/plain');
    res.status(500)
    res.send('500 - Server Error');
})

app.listen(port, () => {
    console.log('express is running on http://localhost:' + port);
    console.log('press ctrl + c to close')
})