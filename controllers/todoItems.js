const handleSaveTodo = (req, res, data) => {
  const { userId, todoId } = req.params;
  const { listItems } = req.body;
  var inc = 0;

  data("todoitems")
    .del()
    .where("todoid", "=", todoId)
    .then((deletedItems) => {
     if(listItems === [])
    {
      data
        .select("*")
        .from("todoitems")
        .where("userid", "=", userId)
        .then((allItems) => {
          res.json(allItems);
        })
        .catch((err) => {
          console.log("error in selecting all items");
          res.status(400).json("unable to save");
        });
    }
else{

  listItems.map((item) => {
    data
    .insert({
      todoid: todoId,
            content: item.content,
            userid: userId,
            ischecked: item.ischecked,
          })
          .into("todoitems")
          .returning("*")
          .then((currentItem) => {
            inc++;
            if (inc === listItems.length) {
              data
              .select("*")
              .from("todoitems")
              .where("userid", "=", userId)
              .then((allItems) => {
                res.json(allItems);
              })
              .catch((err) => {
                console.log("error in selecting all items");
                res.status(400).json("unable to save");
              });
            }
          })
          .catch((err) => {
            // error = "error in adding new todo items "
            console.log(err);
          });
        }); //map ends
      }
    })
    .catch((err) => {
      console.log("cannot delete pre existing todo items");
      res.status(400).json("unable to delete");
    });
};

module.exports = {
  handleSaveTodo,
};
