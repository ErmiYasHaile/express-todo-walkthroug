/////////////////////////
// Dependencies
////////////////////////
const express = require("express")
const router = express.Router()
const Todo = require("../models/Todo")

/////////////////////////////////////////
// Routes
////////////////////////////////////////
router.get("/", async (req, res) => {
    // go get todos
    const todos = await Todo.find({}).catch((err) => res.send(err))

    // render index.ejs
    res.render("index.ejs", {todos})
})

router.get("/seed", async (req, res) => {
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

router.post("/", async (req, res) => {
    // create the todo
    await Todo.create(req.body).catch((err) => res.send(err))
    // redirect back to main page
    res.redirect("/")
})

router.put("/:id", async (req, res) => {
    // get the id from params
    const id = req.params.id
    // get the todo to be updated
    const todo = await Todo.findById(id)
    // update the todos completed property
    todo.completed = true
    await todo.save() // save changes
    // redirect back to main page
    res.redirect("/")
})

////////////////////////
// Export the Router
////////////////////////
module.exports = router