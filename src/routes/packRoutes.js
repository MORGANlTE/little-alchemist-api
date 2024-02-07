const express = require('express');
const router = express.Router();
const db = require('../utils/db'); // Import your database connection
const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Define the route to get a pack by name
router.get('/:name', async (req, res) => {
  console.log("getting pack")
  const packName = req.params.name;
  try {
    const database = await db(); // Use your database connection function
    console.log("getting pack")
    let cardNames = [];

    let urlName = packName.replace(" ", "_").replace("_Pack", "");
    let url = `https://lil-alchemist.fandom.com/wiki/Special_Packs/${urlName}`;
    await axios.get(url).then(response => {
      const dom = new JSDOM(response.data);
      const document = dom.window.document;
    
      let gallery = document.querySelector("div#gallery-0");
      let cards = gallery.querySelectorAll("div.lightbox-caption");
      cards.forEach(card => {
        cardNames.push(card.textContent.trim());
        console.log(card.textContent.trim())
      })
    });
    
    console.log(`${packName}:`);
    console.log(cardNames);

    //get the cards ids 1 by 1 from the database
    let cards = [];
    for (let cardName of cardNames) {
      let card = await database.get(
        `SELECT id FROM cards 
        WHERE 
          LOWER(full_name) LIKE LOWER(?) 
          OR LOWER(full_name) LIKE LOWER(?)
        `,
        [cardName, `%${cardName} (Card)`]
      );
      cards.push(card);
    }

    console.log(cards);

    // For every id: add the id to a string an underscore and 6, then a dash
    let cardIds = "";
    for (let card of cards) {
      cardIds += `${card.id}_6-`;
    }

    //remove the last dash
    cardIds = cardIds.slice(0, -1);

    res.json({ cardIds });
    
  } catch (error) {
    console.error('Error fetching pack:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
