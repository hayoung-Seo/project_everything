const express = require('express');
const app = express();
// const server = require('http').Server(app)
// const io= require('socket.io')(server);


// port
port = 8000;
const server = app.listen(port, () => {console.log(`listening on port ${port}`)})
// server.listen(port, () => {console.log(`listening on port ${port}`)})

// json
app.use(express.json());

// static
app.use(express.static(__dirname + "/public/dist/public"));

// mongoose
mongoose = require('./server/config/mongoose.js');

// routes
// require('./server/config/routes.js')(app)

//sockets
const io = require('socket.io')(server);

var users={};
io.on('connection', function (socket) { //2
    console.log("--connecter");
//     socket.on('got_new_user', function(data){
//         socket.emit('existing_users',users)
//         // console.log(data.name)
//         if (data.name){
//             users[socket.id]=data.name
//             console.log("new user"+data)
//             io.emit('new_user', {name:data.name, id:socket.id})
//             console.log(users)
//         }


//    })
//    socket.on('disconnect', function(){
//        console.log("disconnected id:",socket.id)
//        io.emit('disconnected_user',socket.id)
//        delete users[socket.id]
//        console.log(users)
//    })

//    socket.on('new_msg', function(data){
//        console.log("new_msg: "+data)
//         io.emit('new_message', { name: users[socket.id], msg: data})
//    })
    socket.emit('test_event ','here is some data');
    socket.on('hello',(data)=>{
        console.log(data)
    })
});
require('./server/config/routes.js')(app)
