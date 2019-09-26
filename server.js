const express = require('express');
const app = express();

// port
port = 8000;
const server = app.listen(port, () => {console.log(`listening on port ${port}`)})

// json
app.use(express.json());

// static
app.use(express.static(__dirname + "/public/dist/public"));

// express-session
const session = require('express-session');
app.use(session({
    secret:'project everything', 
    resave: false,
    saveUninitialized: true,
    cookie:{maxAge:120000}
}))

// mongoose
mongoose = require('./server/config/mongoose.js');

// routes
require('./server/config/routes.js')(app)