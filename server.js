const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const PORT =4000;
const Todo = require("./todo.model");
const todoRoutes = express.Router();

async function connectToMongodb(){
    await mongoose.connect("mongodb+srv://raviswamyp:fEENJzkYCQEzw9Gs@cluster0.cv9low3.mongodb.net/?retryWrites=true&w=majority",)
    {useNewUrlParser: true};
    console.log("connected to Mongodb");
}

todoRoutes.route("/").get(async function(req,res){
   const todos = await Todo.find();
   res.send(todos);
})

todoRoutes.route("/:id").get(async function(req,res){
    let id = req.params.id;
   const todoitem = await Todo.findById(id);
   res.send(todoitem);
})

todoRoutes.route("/update/:id").post(async function(req, res){
    const todo = await Todo.findById(req.params.id);

        if(!todo){
            res.status(404).send("Data is not available");
        }
        else{
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json("Todo Updated");
            }).catch(err => {
                res.status(400).send("Update not possible");
            })
        }
})

todoRoutes.route("/add").post(function(req,res){
    let todo = new Todo(req.body);
    todo.save().then(todo => {
        res.status(200).json({ 'todo' : 'todo added successfully'});
    }).catch(err => {
        res.status(400).send('adding new todo failed');
    })
})

todoRoutes.route("/delete/:id").post(async function(req,res){
    const id =  req.params.id;
    const result = await Todo.deleteOne({_id:id});
    res.send(result);
})

app.use(cors());
app.use(bodyParser.json());

app.use('/todos',todoRoutes);

app.listen(PORT, function(){
    connectToMongodb();
    console.log("Server started successfully on PORT : ", PORT);`h`
});