const fs=require('fs')
let {users,arr,rooms}=require('./users')
const io=require('socket.io');
const path=require('path');
const io_server=io();

io_server.on('connection',(socket)=>{
    console.log(`User connected!`);

    socket.on('signup',(data)=>{
        const username=data.username;
        const password=data.password;
        const email=data.email;

        if(!username || !email || !password){
            return {
                err:`All the details are must`,
                succ:false
            };
        }

        const existing =users.find(user=>{
            return user.username===username || user.email===email
        });

        if(existing){
            return {
                err:`Username not available 
                or the email is linked to another username`,
                succ: false
            }
        }

        const user=new users({username,password, email});
        arr.push(user);
        return {err:`User registered successfully! 
        Please login again`,
        succ: true
    }
    })
    socket.on('login',(data)=>{
        const username=data.username
        const password=data.password
        

        const exist=users.find(user=>{
            return user.username===username && user.password===password
        })

        if(!exist){
            return {
                err: `Invalid username or password`,
                succ:false
            }
        }

        return {
            err:`Welcome ${username}!`,
            succ:true,
            username: username
        }

    })
});

io_server.on('logged',(socket)=>{
    console.log('A user just logged in!');

    socket.on('create_room',()=>{

        const room=rooms.push(rooms[rooms.length-1]+1);
        filePath=path.join('/messages',`${room}.txt`);
        filePath=path.resolve(__dirname,filePath);
        const msg=`${username} created this room.
        the id for this room is ${room}`;
        fs.writeFile(filePath,msg);
        return msg;

    })

    socket.on('join_room', (room)=>{
        console.log(`${socket} just joined room ${room}`);
        socket.join(room);
        
        socket.emit('send_msg',room);
        io.to(room).emit('room_joined',`${username} just joined the room.`);
    });

    socket.on('leave_room',(room,username)=>{
        console.log(`${socket} has just left room ${room}`);
        socket.leave(room);

        io.to(room).emit('room_left', `${username} has left the room.`);
        return {
            succ:true,
            err: `Left room ${room} successfully`
        }
    });
    
    
    socket.on('send',(content)=>{
        console.log(`user ${socket} just sent message to room ${content.room}`);
        io.to(content.room).emit('received',{
            id: username,
            message: content.message,
            room: content.room
        })
    });

    socket.on('received',(content)=>{
        const id=content.id;
        const room=content.room;
        const message=document.createElement('message');
        const list=document.querySelector(`./messages/${room}`);
        message.textContent=`${id}: ${content.text}`
        list.appendChild(message);
        
    })
    

    socket.on('logout',(username)=>{
        console.log(`User ${username} just logged out`)
        
        socket.leave('logged');
        
    })

});

module.exports=io_server

