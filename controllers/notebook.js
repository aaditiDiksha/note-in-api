
const handleGetNotebook = (req, res, data) => {
  const { userId } = req.params;

  data
    .select("*")
    .from("notebooks")
    .where("userid", "=", userId)
    .then((notebooks) => {
        data
          .select("*")
          .from("pages")
          .where("userid", "=", userId)
          .then((pages) => res.json({ notebooks:notebooks, pages: pages }))
          .catch((err) => res.status(400).json(err));
      })
    
    .catch((err) => {
      console.log("errrrrrr");
      res.status(400).json(err);
    });
};

const handleAddNotebook = (req, res, data) => {
  const { userId, notebookTitle } = req.params;
   
  data.insert({userid: userId,
     title: notebookTitle,
      created: new Date() })
      .into('notebooks')
      .returning('*')
      .then((currentNB)=>{
        res.json(currentNB[0])
      })
      .catch((err)=>{
        res.status(404).json('cannot add notebook')
      })
};

const handleDelNotebook = (req, res, data) => {
  const { notebookId, userId} = req.params;
  
 data
    .where("notebookid", notebookId)
    .del()
    .from("pages")
    .then((deletedPagesOfNB) => {
      data
        .where("notebookid", notebookId)
        .del()
        .from("notebooks")
        .then((deletedNB) => {
          data
            .select("*")
            .from("notebooks")
            .where("userid", "=", userId)

            .then((notebooks) => {
              res.json(notebooks);
            })
            .catch((err) => {
              res.status(404).json("cannot del notebook");
            });
        })
        .catch((err) => res.status(404).json("not found"));

    })
    .catch((err) => res.status(404).json("not found pages of that notebook"));


};

module.exports = {
  handleAddNotebook,
  handleDelNotebook,
  handleGetNotebook,
};
