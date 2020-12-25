const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");
const app = express();

//https://bezkoder.com/react-node-express-mongodb-mern-stack/
var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

//parse requests of conetnt type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

//simple route
app.get("/", (req, res) => {
    res.json({message:"Welcome to the indexing app."});
});

if(process.env.NODE_ENV === 'production') {
  app.get('/*', function (req, res) {
   	res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

require("./app/routes/declaration.routes.js")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}.`);
});
