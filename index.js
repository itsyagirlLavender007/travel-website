import express from "express"
import path from "path"
import mongoose from "mongoose";

const app = express();
const port = 3000;

mongoose.connect("connections-name",{
    dbName:"userQuotes",
}).then(()=>console.log("Database connected"))
.catch((err)=>console.log(err));

const userSchema = new mongoose.Schema({
    name: String,
    nameLast: String,
    email: String,
    number: Number, 
    select1: String, 
    selectroom: String, 
    departureDate: Date,
    returnDate: Date,
    airport: String,
    budget: Number,
    occassion: String,
    residenceCountry: String,
    timezone: String,
    textarea: String
});

const User = mongoose.model("User", userSchema);

//Using middlewares
app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs") 

//This will render index(main page) 
app.get("/",(req,res)=>{
    res.render("index");
})

// This will render book
app.get('/book', (req, res) => {
    res.render('book'); 
});

//This will render LogIn
app.get('/LogIn', (req, res) => {
    res.render('LogIn'); 
});

//This will render booked
app.get('/booked',(req,res)=>{
    res.render('booked');
})

//For login purposes
app.post("/bookedUsers",(req,res)=>{
    const myEmail = "admin@gmail.com"
    const myPwd = "CarryOn@77777"
    const {email, password} = req.body
    if(myEmail === email && myPwd === password){
        res.redirect("/userDetails");
    }    
    else{
        return res.render("LogIn",{email, message:"Incorrect username or password"});
    }
})


//For sending a quote
app.post("/submit", async (req, res) => {
    const { name, nameLast, email, number, select1, selectroom, departureDate, returnDate, airport, budget, occassion, residenceCountry, timezone, textarea } = req.body;
    try {
        const user = await User.create({
            name,
            nameLast,
            email,
            number,
            select1,
            selectroom,
            departureDate,
            returnDate,
            airport,
            budget,
            occassion,
            residenceCountry,
            timezone,
            textarea
        });
        res.redirect("/booked");
    } catch (error) {
        console.error("Error saving user to the database: ", error);
        res.status(500).send("An error occurred while submitting your request.");
    }
});

//For getting all the user details
app.get("/userDetails", async (req, res) => {
    try {
        const users = await User.find(); 
        res.render("userDetails", { users });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).send("An error occurred while fetching the data.");
    }
});


app.listen(port,()=>{
    console.log("SERVER WORKING SUCCESSFULLY");
})
