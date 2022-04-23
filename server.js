//////////////////////////////
// Importing Our Dependencies
//////////////////////////////
require("dotenv").config() // get our .env variables
const express = require("express") // web framework
const methodOverride = require("method-override") // override request methods
const morgan = require("morgan") // be used for logging
const TodoRouter = require("./controllers/TodoController")


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
app.use("/todo",TodoRouter)


///////////////////////////
// Server Listener
//////////////////////////
 const PORT = process.env.PORT
 app.listen(PORT,()=> console.log(`listening on port ${PORT}`))