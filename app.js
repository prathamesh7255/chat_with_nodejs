const express=require('express');
const app=express();
const methods=require('./methods');

app.use(express.static('./messages'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use('/',methods);

app.listen(5000,()=>{
    console.log('Server is listening to the port 5000...');
})
