const express = require('express');
const app = express();

// port
port = 8000;
const server = app.listen(port, () => {console.log(`listening on port ${port}`)})

// json
app.use(express.json());

// static
app.use(express.static(__dirname + "/public/dist/public"));

// mongoose
mongoose = require('./server/config/mongoose.js');

// routes
require('./server/config/routes.js')(app)