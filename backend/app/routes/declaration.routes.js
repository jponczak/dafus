module.exports = app => {
    const declarations = require("../controllers/declaration.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Declarations
    router.get("/", declarations.findAll);
  
    // // Retrieve all published Declarations
    // router.get("/published", declarations.findAllPublished);
  
    // Retrieve a single Declarations with id
    router.get("/:id", declarations.findOne);
  
    app.use('/api/declarations', router);
  };