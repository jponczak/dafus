const db = require("../models");
const Declaration = db.declarations;

const getPagination = (page, size) => {
  const limit = size ? + size : 20;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

//retrieve a single Declaration with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Declaration.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Declaration with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Declaration with id=" + id });
      });
  };

//find all declarations
exports.findAll = (req, res) => {
  console.log("querying ...");
  const { page, size, combined } = req.query;
  console.log("node controller", page, size, combined);
  var condition = combined ? { combined: { $regex: new RegExp(combined), $options: "i" } } : {};
  const { limit, offset } = getPagination(page, size);

  Declaration.paginate(condition, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        declarations: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1
      });
    })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving declaration."
        });
      });
};
