const express = require("express");
const { ObjectId } = require("mongodb");
const db = require("../database.js");
const utils = require("../utils.js");
const dateTime = require("node-datetime");

const router = express.Router();

router.get("/", async (req, res) => {
  const todosCollection = await db.getTodosCollection();
  const todos = await todosCollection.find().toArray();

  res.render("list", { todos });
});

router.get("/create", async (req, res) => {
  res.render("create");
});

router.post("/create", async (req, res) => {
  const todosCollection = await db.getTodosCollection();
  const dt = dateTime.create();
  const formatted = dt.format("Y-m-d H:M:S");
  const newTodo = {
    created: new Date(),
    description: req.body.description,
    done: false,
    formatted: formatted,
  };
  if (utils.validateTodo(newTodo)) {
    await todosCollection.insertOne(newTodo);

    res.redirect("/todos");
  } else {
    const todos = await todosCollection.find().toArray();
    res.render("list", { todos, error: "Please enter a task" });
  }
});

router.get("/:id", async (req, res, next) => {
  let id = undefined;
  try {
    id = ObjectId(req.params.id);
  } catch {
    next();
  }
  if (id) {
    const collection = await db.getTodosCollection();
    collection.findOne({ _id: id }, (err, todo) => {
      if (todo) {
        res.render("single", todo);
      } else {
        next();
      }
    });
  }
});

router.get("/:id/edit", async (req, res, next) => {
  let id = undefined;
  try {
    id = ObjectId(req.params.id);
  } catch {
    next();
  }
  if (id) {
    const collection = await db.getTodosCollection();
    collection.findOne({ _id: id }, (err, todo) => {
      if (todo) {
        res.render("edit", todo);
      } else {
        next();
      }
    });
  }
});

router.post("/:id/edit", async (req, res, next) => {
  let id = undefined;
  try {
    id = ObjectId(req.params.id);
  } catch {
    next();
  }
  if (id) {
    const todo = {
      description: req.body.description,
      done: Boolean(req.body.done),
    };
    if (utils.validateTodo(todo)) {
      const collection = await db.getTodosCollection();
      await collection.updateOne({ _id: id }, { $set: todo });

      res.redirect("/todos");
    } else {
      res.render("edit", {
        error: "The inputfield is empty",
        _id: id,
        description: todo.description,
        done: todo.done,
      });
    }
  }
});

router.get("/:id/delete", async (req, res, next) => {
  let id = undefined;
  try {
    id = ObjectId(req.params.id);
  } catch {
    next();
  }
  if (id) {
    const collection = await db.getTodosCollection();
    collection.findOne({ _id: id }, (err, todo) => {
      if (todo) {
        res.render("delete", todo);
      } else {
        next();
      }
    });
  }
});

router.post("/:id/delete", async (req, res, next) => {
  let id = undefined;
  try {
    id = ObjectId(req.params.id);
  } catch {
    next();
  }
  if (id) {
    const collection = await db.getTodosCollection();
    await collection.deleteOne({ _id: id });

    res.redirect("/todos");
  }
});

router.get("/done", async (req, res) => {
  const todosCollection = await db.getTodosCollection();
  const todos = await todosCollection.find().toArray();

  let checkDone = false;
  for (todo of todos) {
    if (todo.done) {
      checkDone = true;
    }
  }
  res.render("done", { todos, checkDone });
});

router.get("/current", async (req, res) => {
  const todosCollection = await db.getTodosCollection();
  const todos = await todosCollection.find().toArray();

  let checkDone = false;
  for (todo of todos) {
    if (!todo.done) {
      checkDone = true;
    }
  }
  res.render("current", { todos, checkDone });
});

router.get("/newest", async (req, res) => {
  const todosCollection = await db.getTodosCollection();
  const todos = await todosCollection.find().toArray();

  todos.sort((a, b) => b.created - a.created);
  console.log(todos);

  res.render("list", { todos });
});

router.get("/oldest", async (req, res) => {
  const todosCollection = await db.getTodosCollection();
  const todos = await todosCollection.find().toArray();

  todos.sort((a, b) => a.created - b.created);
  console.log(todos);

  res.render("list", { todos });
});

module.exports = router;
