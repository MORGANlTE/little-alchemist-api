var express = require("express");
var app = express();
var sqlite3 = require('sqlite3');
var { open } = require('sqlite');
var cardRoutes = require('./src/routes/cardRoutes');
var packRoutes = require('./src/routes/packRoutes');
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
    app.use('/api/packs', packRoutes);

    // Root endpoint
    app.get("/", (req, res, next) => {
      res.json({ "message": "Ok", "version": "1.8.2", "latest": "Bugfix in /fullcombos route (added this route in 1.8)",
      "All routes for now": {
        "/api/cards":"Get all the cards with little to no info",
        "/api/cards/:name":"Get a specific card by it's name",
        "/api/cards/:id":"Get a card by it's id",
        "/api/cards/combos/:name":"Get all the combos of a card (little information)",
        "/api/cards/recipes/:name":"Get all the recipes of a card",
        "/api/cards/fullcombos":"Get all the fullcombos with all their information (detailed)",
        "/api/packs/:name":"Get a pack by it's name",
      },
    });
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
