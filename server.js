const express = require("express");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcrypt");
const register = require("./controllers/register");
const signin = require("./controllers/siginin");
const notebook = require("./controllers/notebook");
const page = require("./controllers/page");
const todo = require("./controllers/todo");
const todoItems = require("./controllers/todoItems");


const data = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(cors());


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const port = 3000;

app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  
app.post("/register", (req, res) => {
  register.handleRegister(req, res, data, bcrypt);
});
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, data, bcrypt);
});


// -----------NOTEBOOKS---------------------
app.get("/profile/notebooks/:userId", (req, res) => {
  notebook.handleGetNotebook(req, res, data);
});
app.post("/profile/:userId/addNotebook/:notebookTitle", (req, res) => {
  notebook.handleAddNotebook(req, res, data);
});

app.post("/profile/delNotebook/:notebookId", (req, res) => {
  notebook.handleDelNotebook(req, res, data);

});
  // ---------------PAGES--------------------
app.post("/profile/:userId/:notebookId/addPage/:pageTitle", (req, res) => {
    page.handleAddPage(req, res, data);
  });

app.post("/profile/:notebookId/delPage/:pageId", (req, res) => {
  page.handleDelPage(req, res, data);
});

// ---------------CONTENT--------------------

app.post("/profile/saveContent/:pageId", (req, res) => {
  page.handleSaveContent(req, res, data);
});  //get????

// ---------------TODO'S--------------------
app.get("/profile/todo/:userId", (req, res) => {
  todo.handleGetTodo(req, res, data);
});
app.post("/profile/:userId/addTodo/:todoTitle", (req, res) => {
  todo.handleAddTodo(req, res, data);
});

app.post("/profile/delTodo/:todoId", (req, res) => {
  todo.handleDelTodo(req, res, data);
});
//-------------TODO ITEMS-------------------
app.post("/profile/saveTodo/:userId/:todoId", (req, res) => {
  todoItems.handleSaveTodo(req, res, data);
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
