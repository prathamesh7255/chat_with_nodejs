const io_client=require('socket.io-client');
const io_server=require('./socket_server');

const socket=io_client()

socket.on('new_user',()=>{
    const username=prompt('Please enter your username: ');
    const password=prompt('Please enter your password: ');
    const email=prompt('Please enter your email: ');
    const data={username,password,email};
    let status=socket.emit('signup',(data));
    if(status.succ){
        socket.emit('old_user');
    }
    return status;

})

socket.on('old_user',()=>{
    const username=prompt('Please enter your username: ');
    const password=prompt('Please enter your password: ');
    
    const data={username,password};
    let status=socket.emit('login',(data));
    return status;
})

socket.on('send_msg',(room)=>{
const messageForm=document.querySelector('message');
    messageForm.addEventListener('submit',(event)=>{
        event.preventDefault();
        const input=document.querySelector('input');

        const message={
            text: input.value
        };

        socket.emit('send',{room,message});
        input.value=''
    })
});

socket.on('create',()=>{
    socket.emit('create_room');
    socket.on('create_room',(status)=>{
        return status;
    })
})

socket.on('join',()=>{
    const room=prompt('Please enter the room ID you want to join: ');
    socket.emit('join_room',room);
})

socket.on('leave',(room,username)=>{
    socket.emit('leave_room',(room,username));
    socket.on('leave_room',status=>{
        return status;
    })
})

socket.on('signout',(username)=>{
    socket.emit('logout',(username));
})

module.exports=socket
