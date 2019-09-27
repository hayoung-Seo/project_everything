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
// require('./server/config/routes.js')(app)

//sockets
const io = require('socket.io')(server);

var all_users=[];
var all_chat=[]
io.on('connection', function (socket) { //2
    // console.log("--connecter");
    socket.on('got_new_user', function(data){
        console.log("---inside gserver user collection," , data);
        
        let user={id:'',name:''};
            user.id=socket.id
            user.name=data.name
            console.log("new user####: "+user.name)
            // io.emit('new_user', user)
            // console.log(user)
            all_users.push(user)
            for(var i of all_users){
                console.log("********in server all_users", i['name'] )

            }
            
            io.emit('existing_users',all_users)
   })
   socket.on('disconnect', function(){
       console.log("disconnected id:",socket.id)

        all_users=all_users.filter(function(x){
            return x.id !== socket.id
        })    
         io.emit('updated_all_users',all_users)
   })

//    socket.on('new_msg', function(data){
//        console.log("new_msg: "+data)
//         io.emit('new_message', { name: users[socket.id], msg: data})
//    })



    socket.on('this_chat',function(data){
        console.log("******new_msg "+data)
        all_chat.push(data)
        for(var i of all_chat){
            console.log("********in server all_chat", i['msg'] )

        }
        io.emit('all_chat_rtn', all_chat)
    });


});
require('./server/config/routes.js')(app)
