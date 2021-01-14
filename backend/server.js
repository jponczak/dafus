const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");
const app = express();
let http = require('http');
let https = require('https');
let fs = require('fs');


app.use(cors());
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
    res.json({message:"Welcome to the LOC app."});
});

require("./app/routes/declaration.routes.js")(app);

if (process.env.NODE_ENV === 'production') {
  let privateKey = fs.readFileSync('/etc/letsencrypt/live/dafus.org/privkey.pem','utf8');
  let certificate = fs.readFileSync('/etc/letsencrypt/live/dafus.org/fullchain.pem','utf8');
  var credentials = {key: privateKey, cert: certificate};

  app.get('/*', function (req, res) {
   	res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(8443, () => {
    console.log('https server running on port 8443');
  });
  
} else {
  var httpServer = http.createServer(app);

  httpServer.listen(8080, () => {
    console.log('http server running on port 8080');
  });
  
}



// const PORT = process.env.PORT || 5000;
// app.listen(PORT,() => {
//     console.log(`Server is running on port ${PORT}.`);
// });
