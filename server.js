var express = require("express");
var app = express();
var sqlite3 = require('sqlite3');
var { open } = require('sqlite');
var cardRoutes = require('./src/routes/cardRoutes');
const cors = require('cors');

var HTTP_PORT = 8000;
var openDb = require('./src/utils/db');

// Function to start the server and initialize the database
async function startServer() {
  try {
    // Initialize the database by calling openDb
    await openDb();

    app.use(cors());

    //add a listener that logs every request
    app.use(function (req, res, next) {
      console.log(req.method, req.url);
      next();
    });

    // Start server
    app.listen(HTTP_PORT, () => {
      console.log("Server running on port " + HTTP_PORT);
    });

    // Database routes
    // from lil-alchemist-api/src/routes/cards.js:
    app.use('/api/cards', cardRoutes);

    // Root endpoint
    app.get("/", (req, res, next) => {
      res.json({ "message": "Ok", "version": "1.6.1", "latest": "Updated database" });
    });


    // Default response for any other request
    app.use(function (req, res) {
      res.status(404).send("Not Found");
    });

  } catch (error) {
    console.error("Database connection error:", error);
  }
}

// Call the startServer function to initialize the database and start the server
startServer();
