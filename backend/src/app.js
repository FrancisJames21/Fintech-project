const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const LogInCollection = require("./db/conn");
const bcrypt = require('bcrypt');
const port = process.env.PORT || 8080;
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.set("view engine", "hbs");
app.use (express.static("public"));
app.set("views", templates_path); 
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});



app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    // check if the user already exists in the database
    const checking = await LogInCollection.findOne({ name: data.name });

    if (checking) {
        res.send ("user already exists, Please choose a different name ")
        // User already exists, render the home page with the existing user's name
        return res.render("home", { naming: data.name });
    } else {
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the hashed password with the original password

        const userdata = await LogInCollection.create(data);
        console.log(userdata);

        // User created successfully, render the home page with the new user's name
        return res.render("home", { naming: data.name });
    }
});


app.post("/login", async (req, res) => {
    try{
         // Retrieve user from the database based on the provided username

        const check =await LogInCollection.findOne({name: req.body.username});

        // If user not found, send a response indicating that the username cannot be found

        if(!check) {
            res.send("user name cannot found");
        }
        // Compare the provided password with the hashed password stored in the database

        const isPasswordMatch = await bcrypt.compare(req.body.password,check.password); 
        
         // If passwords match, render the "home" page
        if(isPasswordMatch) {
            res.render ("home");
// If passwords do not match, send a response indicating that the password is incorrect
        }else {
            req.send("wrong password");
        }
 // Handle any unexpected errors and send a response indicating wrong details
    }catch{
        res.send("wrong Details");
    }    
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
 