const express=require('express');
const app=express();
const http= require('http').createServer(app);
const io=require('socket.io')(http);
let server=io(http);


app.use(express.static('./messages'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())


app.listen(5000,()=>{
    console.log('Server is listening to the port 5000...');
})


module.exports=server