const express=require('express');
const app=express();

app.get('/',(req,res)=>{
        res.json(`<h1>Welcome Home, buddy!</h1>
        <p>New user?</p>
        <a href="/signup">Signup here</a>
        <p>Alraedy have an account?</p>
        <a href="/login">Login</a>`);
});

app.get('/signup',(req,res)=>{
    
})





