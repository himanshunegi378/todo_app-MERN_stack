const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router(); // Create an instance of the Express Router
const PORT = 4000;
const mongoURI = require('./config').MongoURI

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(mongoURI, { useNewUrlParser: true })
     .then(() => console.log('Mongo db connected'))
     .catch(err => console.log(err));


// GET: Retrieve list of all todo items from the MongoDB database.
todoRoutes.route('/')
     .get(function (req, res) {
          Todo.find()
               .then(todos => {
                    if (todos)
                    {
                         res.json(todos);
                    }
                    else
                    {
                         res.status(404).json({ 'msg': "Resource not found" })
                    }
               })
               .catch(err => console.log(err))
     });

// GET: Retrieve a todo item by providing an ID.
todoRoutes.route('/:id').get(function (req, res) {
     let id = req.params.id;
     Todo.findOne({ _id: id })
          .then(todo => {
               if (!todo)
               {
                    return res.status(404).json({ error: "resource not found" })
               }
               return res.status(200).json(todo);
          })
});

// POST: Add New Todo Item to MongoDB Database.
todoRoutes.route('/add').post(function (req, res) {
     let todo = new Todo(req.body);
     todo.save()
          .then(todo => {
               res.status(200).json({"todo": todo ,'msg': 'todo added successfully' });
          })
          .catch(err => {
               console.log(err)
               res.status(400).send('adding new todo failed');
          });
});

// GET: Delete a existing todo item by providing an ID.
todoRoutes.route('/delete/:id').post((req, res) => {
     Todo.findByIdAndDelete(req.params.id)
          .then(() => res.json({ msg: "deleted" }))
          .catch(err => console.log(err))

})

// POST: Update a existing todo item by providing an ID.
todoRoutes.route('/update/:id').post(function (req, res) {
     Todo.findById(req.params.id, function (err, todo) {
          if (!todo)
               res.status(404).send("data is not found");
          else
          {
               todo.todo_description = req.body.todo_description;
               todo.todo_responsible = req.body.todo_responsible;
               todo.todo_priority = req.body.todo_priority;
               todo.todo_completed = req.body.todo_completed;
          }
          todo.save().then(todo => {
               res.json('Todo updated!');
          })
               .catch(err => {
                    res.status(400).send("Update not possible");
               });
     });
});

// The router added as a middleware and take control of request starting with path '/todos'
app.use('/todos', todoRoutes);

app.listen(PORT, function () {
     console.log("Server is running on Port: " + PORT);
});