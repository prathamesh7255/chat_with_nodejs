
io.on('connection',(socket)=>{
    console.log(`User connected!`);
    
    socket.on('signup',(data)=>{
        if(!data.username || !email){
            return {
                err:`Username and email are must`
            };
        }

        const existing =users.find(user=>{
            return user.username===data.username || user.email===data.email
        });

        if(existing){
            return {
                err:`Username not available 
                or the email is linked to another username`
            }
        }

        const user={data.username,data.password, data.email}
        users.push(user);
        return `User registered! Please login again `
    })
    socket.on('login',(data)=>{
        const username=data.username
        const password=data.password

        const exist=users.find(user=>{
            return user.username===username && user.password===password
        })

        if(!exist){
            return {
                err: `Invalid username or password`
            }
        }

        return io.emit('logged',(data));

    })

    socket.on('disconnect',()=>{
        console.log(`User ${socket} just disconnected`);
        return 
    });
});

io.on('logged',(data)=>{
    console.log('A user just logged in!');

    const username=data.username
    const socket=data.socket

    socket.on('joinroom', (room)=>{
        console.log(`${socket} just joined room ${room}`);
        socket.join(room);

        io.to(room).emit('roomroined',`${username} just joined the room.`);
    });

    socket.on('leaveroom',(room)=>{
        console.log(`${socket} has just left room ${room}`);
        socket.leave(room);

        io.to(room).emit('roomreft', `${username} has left the room.`);
    });

    socket.on('received',(content)=>{
        const id=content.id;
        const room=content.room;
        const message=document.createElement('message');
        const list=document.querySelector(`./messages/${room}`);
        message.textContent=`${id}: ${content.text}`
        list.appendChild(message);
        
    })
    
    const messageForm=document.querySelector('message');
    messageForm.addEventListener('submit',(event)=>{
        event.preventDefault();
        const input=document.querySelector('input');

        const message={
            text: input.value
        };

        socket.emit('send',message);
        input.value=''
    })
    socket.on('send',(content)=>{
        console.log(`user ${socket} just sent message to room ${content.room}`);
        io.to(content.room).emit('message',{
            id: username,
            message: content.message
        })
    });

    socket.on('logout',(username)=>{
        console.log(`User ${username} just logged out`)

        return io.emit('connection',(socket));
    })

});