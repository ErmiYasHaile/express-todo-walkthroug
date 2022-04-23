//////////////////////////////
// Importing Our Dependencies
//////////////////////////////
require("dotenv").config() // get our .env variables
const express = require("express") // web framework
const mongoose = require("mongoose") // Object Document Manager (Work with DB)
const methodOverride = require("method-override") // override request methods
const morgan = require("morgan") // be used for logging

//////////////////////////////
// Setup Database Connection
//////////////////////////////
// loading db url
const DATABASE_URL = process.env.DATABASE_URL

//establish connection
mongoose.connect(DATABASE_URL)

//Save the connection
const cxn = mongoose.connection

// setup mongoose connection messages
cxn
.on("open", () => console.log("The Mongo Connection is Open"))
.on("close", () => console.log("The Mongo Connection is Closed"))
.on("error", (err) => console.log(err))


////////////////////////
// Schemas and Models
////////////////////////
//Schema the definition of our data type
// model, the object for working with our data type
const todoSchema = new mongoose.Schema({
    text: String,
    completed: Boolean
},{timestamps:true})
const Todo =mongoose.model("Todo",todoSchema)

/////////////////////////////
// Create Express apllication
/////////////////////////////
const app = express()

////////////////////////////////////////
// Middleware - app.use(middleware function)
/////////////////////////////////////////
app.use(methodOverride("_method")) // override request methods for form submissions
app.use(morgan("dev")) // log every request
app.use(express.urlencoded({extended: true})) // parse html form bodies into req.body
app.use("/static", express.static("static")) // serve files statically

/////////////////////////////
// Routes
/////////////////////////////
app.get("/",async(req,res)=>{
    // go get todos
    const todos = await Todo.find({})
    //render index.ejs
    // res.send("<h1>Hello World</h1>")
    res.render("index.ejs", {todos})
})

app.get("/todo/seed", async (req, res) => {
    // delete all existing todos
    await Todo.remove({}).catch((err) => res.send(err))
    // add you sample todos
    const todos = await Todo.create([
        {text: "eat breakfast", completed: false},
        {text: "eat lunch", completed: false},
        {text: "eat dinner", completed: false}
    ]).catch((err) => res.send(err))
    // send the todos as json
    res.json(todos)
})

app.post("/todo", async (req, res) => {
    // create the todo
    await Todo.create(req.body).catch((err) => res.send(err))
    // redirect back to main page
    res.redirect("/")
})
 app.put("/todo/:id", async(req,res)=>{
     // get the id from the params
     const id = req.params.id
     //get the todo to be updated
     const todo = await Todo.findById(id)
     //update the todos completed property
     todo.completed = true
    todo.save() // save changes
    // redirect back to main page
    res.redirect("/")
 })

///////////////////////////
// Server Listener
//////////////////////////
 const PORT = process.env.PORT
 app.listen(PORT,()=> console.log(`listening on port ${PORT}`))