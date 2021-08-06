const handleAddPage = (req, res, data) => {
  const { notebookId, pageTitle, userId } = req.params;
  data
    .insert({ notebookid: notebookId, 
      title: pageTitle, 
      userid: userId,
      created: new Date() })
    .into("pages")
    .returning("*")
    .then((currentPage) => {
      res.json(currentPage[0]);

    })
    .catch((err) => {
      res.status(404).json("cannot add page");
    });
};

const handleDelPage = (req, res, data) => {
  const { notebookId, pageId } = req.params;
  data
    .where("pageid", pageId)
    .del()
    .from("pages")
    .then((deletedNB) => {
      if(deletedNB){
      data
        .select("*")
        .from("pages")
        .then((pages) => {
          data
            .where("notebookid", notebookId)
            .select("*")
            .from("pages")
            .then((currentPages) => {

                res.json({ 
                currentPages: currentPages,
                pages: pages,
              })
            })
            .catch((err) => 
            {
              res.status(404).json("Current pages not found")
            }
              );
        })
        .catch((err) => {

          res.status(404).json("all pages not found");
        });
      }
      else{

        res.status(400).json('page id not found')
      }
    })
    .catch((err) => {
      
      res.status(404).json("cannot del page")});
};



const handleSaveContent = (req, res, data) => {
  const {  pageId } = req.params;
  const { content } = req.body;
    data('pages')
    .where('pageid', '=', pageId)
    .update({
      content: content,

    })
      .returning("*")
      .then((currentPage) => {
       res.json(currentPage[0])
      })
      .catch((err) => {
        res.status(404).json(err);
      });
  
};



module.exports = {
  handleAddPage,
  handleDelPage,
  handleSaveContent,
};
