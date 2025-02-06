const express = require('express')
 
const app = express()

//Setup the template engine
const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

// To set the port execute: port=8080 node miami  
const port = process.env.port || 3002
//Create some routes

const path = require('path');

// Register Handlebars partials
// app.engine(
//   'handlebars',
//   handlebars.engine({ partialsDir: path.join(__dirname, 'views', 'partials') })
// );


let navigation = require('./data/navigation.json')
app.get('/', (request,response)=>{
    response.type("text/html")
    response.render("home",{title:"Miami Travel Site", nav: navigation})
})

app.get('/beaches', (request,response)=>{
    response.type("text/html")
    response.render("page", {title :"Miami Beaches", nav: navigation})
})

app.get('/nightlife', (request,response)=>{
    response.type("text/html")
    response.render("page",{title:"Miami Night Life", nav: navigation})
})

app.get('/about', (request, response)=>{
    response.type("text/html")
    response.render("page",{title: "About Miami", nav: navigation})
})
// Query, params and body 
app.get('/search', (request, response)=>{
    console.log(request)
    response.type("text/html")
    response.render("page",{title: "Search results for: " + request.query.q})

})

//error handling goes after the actual routes
//The default response is not found
app.use((request,response) => {
    response.type("text/html")
    response.status(404)
    response.send("404 not found")
})
//Server Error
app.use ( (error, request,response,next)=>{
    console.log(error)
    response.type("text/html")
    response.status(500)
    response.send("500 server error") 
})

//start the server
app.listen(port, ()=> {
    console.log(`Express is running on http://localhost:${port};`)
    console.log(` press Ctrl-C to terminate.`)
    })