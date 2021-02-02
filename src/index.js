const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json()); // added body key to req
app.use(
  cors({
    credentials: true,
    origin: "*", //"https://todo-frontend-devojyoti.herokuapp.com/",
  })
);

// connect

// const db = mongoose.createConnection("mongodb://localhost:27017/TodoApp", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

/////

const mongoUrl =
  "mongodb+srv://Devojyoti:Devo@1995@cluster0.whpdu.mongodb.net/ToDo?retryWrites=true&w=majority";
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch(() => {
    console.log("Error in DB connection");
  });

// schemas

const todoSchema = new mongoose.Schema({
  task: String,
  creationTime: Date,
});
// models

// const todoModel = db.model("todo", todoSchema);
const todoModel = mongoose.model("todo", todoSchema);

// backend apis
const isNullOrUndefined = (val) => val === null || val === undefined;

app.get("/", async (req, res) => {
  res.send("Server started!!");
});

app.post("/todo", async (req, res) => {
  const todo = req.body;
  todo.creationTime = new Date();

  const newTodo = new todoModel(todo);
  await newTodo.save();
  res.status(201).send(newTodo);
});

app.put("/todo/:todoid", async (req, res) => {
  const { task } = req.body;
  const todoid = req.params.todoid;

  try {
    const todo = await todoModel.findOne({ _id: todoid });
    if (isNullOrUndefined(todo)) {
      res.sendStatus(404);
    } else {
      todo.task = task;
      await todo.save();
      res.send(todo);
    }
  } catch (e) {
    res.sendStatus(404);
  }
});

app.delete("/todo/:todoid", async (req, res) => {
  const todoid = req.params.todoid;

  try {
    await todoModel.deleteOne({ _id: todoid });
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(404);
  }
});

app.listen(process.env.PORT);
