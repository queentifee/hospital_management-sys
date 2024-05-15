const express = require('express');
const path = require('path');
const bcrypt = require ('bcrypt');
const collection = require ('./config')

const app = express();

app.use(express.json());

app.use(express.static("public"));

app.use(express.urlencoded({extended:false}));


app.set("view engine", "ejs");

app.get("/home",(req, res) =>{
    res.render("home");
});

app.get("/signup",(req,res)=>{
    res.render("signup");
});

app.get("/login",(req,res)=>{
    res.render("login");
});
app.get("/dashboard",(req,res)=>{
    res.render("dashboard");
});


app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        // If user already exists, send a response with a message
        return res.send('User already exists. Please choose a different username.');
    }

    try {
        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;

        const userdata = await collection.insertMany(data);
        console.log(userdata);
        // Redirect to a different URL after successful signup
        return res.redirect('/login'); // Redirect to the dashboard page
    } catch (error) {
        console.error("Error occurred while signing up:", error);
        return res.status(500).send('Internal Server Error');
    }
});

// Login user

app.post("/login", async (req, res) => {
        try {
         const check = await collection.findOne({ name: req.body.username })
         if (!check) {
            res.send("User name does not exist")
         }
         // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
             res.send("wrong Password");
        }
            else {
            res.render("dashboard");
     }
    }

        catch {
        res.send("wrong Details");
        }
})

// port number
const port = 4000;
app.listen(port,()=>{
    console.log(`Server is running on port:${port}`);
})