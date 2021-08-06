
const handleGetTodo = (req, res, data) => {
  const { userId } = req.params;

  data
    .select("*")
    .from("todolist")
    .where("userid", "=", userId)
    .then((todos) => {
      data
        .select("*")
        .from("todoitems")
        .where("userid", "=", userId)
        .then((items) => res.json({ todos: todos, items: items }))
        .catch((err) => res.status(400).json(err));
    })

    .catch((err) => {
      console.log("errrrrrr");
      res.status(400).json(err);
    });
};

const handleAddTodo = (req, res, data) => {
  const { userId, todoTitle } = req.params;

  data
    .insert({ userid: userId, title: todoTitle, created: new Date() })
    .into("todolist")
    .returning("*")
    .then((currentTodo) => {
      res.json(currentTodo[0]);
    })
    .catch((err) => {
      res.status(404).json("cannot add Todo");
    });
};

const handleDelTodo = (req, res, data) => {
  const { todoId } = req.params;

  data
    .where("todoid", todoId)
    .del()
    .from("todoitems")
    .then((deletedItemssOfTodo) => {
      data
        .where("todoid", todoId)
        .del()
        .from("todolist")
        .then((deletedTodo) => {
          data
            .select("*")
            .from("todolist")
            .then((todos) => {

              res.json(todos);
            })
            .catch((err) => {
              res.status(404).json("cannot del Todo");
            });
        })
        .catch((err) => res.status(404).json("not found"));
    })
    .catch((err) => res.status(404).json("not found items of that Todo"));
};

module.exports = {
  handleAddTodo,
  handleDelTodo,
  handleGetTodo,
};
