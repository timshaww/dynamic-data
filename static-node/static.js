const http = require('node:http');
const fs = require('node:fs');

const hostname = '127.0.0.1';
const port = 3000;
// functions
// syntax of a function

const someName = (name) => {
    console.log('your name is ' + name)
}

const path = 'public/home.html'

someName('tim shaw')

const displayPage = (path, r, statusCode = 200) => {
    r.statusCode = statusCode;
    r.setHeader('Content-Type', 'text/html');

    fs.readFile(path, (err, data) => {
        if (err) {
            console.log(err)
            r.statusCode = 500;
            r.end('500 -- error')
        } else {
            r.end(data)
        }
    })
}

const server = http.createServer((req, res) => {
    console.log(req.url)

    switch (req.url) {
        case '/':
        case '':
            displayPage('public/home.html', res)
            break;
        case '/about':
            displayPage('public/about.html', res)
            break;
        case '/contact':
            displayPage('public/contact.html', res)
            break;
        default:
            displayPage('public/404.html', res, 404)

    }

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/ --- Press ctrl+c to close`);
});