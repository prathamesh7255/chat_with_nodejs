const express=require('express');
const app=express();

let socket_client=require('./socket_client');
let io_server=require('./socket_server');

app.get('/',(req,res)=>{
    io_server.emit('connection',(socket_client));
    res.json(`<h1>Welcome Home, buddy!</h1>
    <p>New user?</p>
    <a href="/signup">Signup here</a>
    <p>Alraedy have an account?</p>
    <a href="/login">Login</a>`);
});

app.get('/signup',(req,res)=>{
    socket_client.emit('new_user');
    res.json(`
    Please fill in the details given below`);

    socket_client.on('new_user',(status)=>{
        
        res.json(status.err);

    })
})

app.get('/login',(req,res)=>{
    socket_client.emit('old_user');
    res.json(`
    Please fill in your credentials`);

    socket_client.on('old_user',(status)=>{
        if(status.succ){
            res.json(`Logged in successfully`);
            const username=status.username;
            res.redirect(`/${username}`)
        }
        res.json(status.err);
        })
})

app.get('/:username',(req,res)=>{
    io_server.emit('logged',socket_client);
    const username=req.body;
    res.json(`<h1>Please select among the following options</h1>
    <a href="/${username}/create">Create New Room</a>
    <a href="/${username}/join">Join Room</a>
    "`);
})

app.get('/:username/create',(req,res)=>{
    const username=req.body;
    socket_client.emit('create',username);
    socket_client.on('create',(status)=>{
        res.json(status);
    })
})

app.get('/:username/join',(req,res)=>{
    const username=req.body;
    const room =prompt(`Please enter the room id you want to join`);
    socket_client.emit('join',(room));
    socket_client.on('join',(status)=>{
        if(status.succ){
            res.json(status.err);
            res.redirect(`/${username}/${room}`);
        }
        res.json(status.err);
    })
})

app.get('/:username/:room/leave',(req,res)=>{
    const username=req.params.username;
    const room=req.params.room;
    socket_client.emit('leave',(room,username));
    socket_client.on('leave',status=>{
        if(status.succ){
            res.json(status.err);
            res.redirect(`/${username}`);
        }
        res.json(status.err);
    })
})

app.get('/:username/logout',(req,res)=>{
    const username=req.body;
    socket_client.emit('signout',(username));
    res.json(`Logged out successfully`)
    res.redirect('/');

})






