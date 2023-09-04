const express = require('express');
const router = express.Router();
const db = require('../utils/db'); // Import your database connection

// Define the route to get a card by ID
router.get('/:name', async (req, res) => {
  const cardName = req.params.name;

  try {
    const database = await db(); // Use your database connection function


    const cards = await database.all(
      `SELECT * FROM cards 
      WHERE 
        LOWER(full_name) LIKE LOWER(?) OR 
        (LOWER(full_name) LIKE LOWER(?)
        OR LOWER(full_name) LIKE LOWER(?))
      `,
      [cardName, `%${cardName} (Onyx)`, `%${cardName} (Card)`]
    );

    //now i want to get the different stats for each level for each card
    // i have a table called card_level_stats
    // i want to get the stats for each card: level (1 to 5 always) with the level corresponding attack and defense
    for(var card in cards)
    {
      const cardId = cards[card].id;
      const cardLevelStats = await database.all(
        `SELECT * FROM card_level_stats
        WHERE card_id = ?
        `,
        [cardId]
      );
      //remove the id and the card_id from the card_level_stats
      for(var stat in cardLevelStats)
      {
        delete cardLevelStats[stat].id;
        delete cardLevelStats[stat].card_id;
      }
      cards[card].stats = cardLevelStats;
    }

    if (!cards) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Respond with the retrieved card
    res.json(cards);
    
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/recipes/:name', async (req, res) => {
  const cardName = req.params.name;

  try {
    const database = await db(); // Use your database connection function


    const recipes = await database.all(
      `SELECT * FROM recipes 
      WHERE 
        LOWER(result) LIKE LOWER(?) OR 
        (LOWER(result) LIKE LOWER(?)
        OR LOWER(result) LIKE LOWER(?))
      `,
      [cardName, `%${cardName} (Onyx)`, `%${cardName} (Card)`]
    );

    for (var recipe in recipes)
    {
      delete recipes[recipe].id;
    }
    
    console.log(recipes);

    if (!recipes) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Respond with the retrieved card
    res.json(recipes);
    
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/combos/:name', async (req, res) => {
  const cardName = req.params.name;

  try {
    const database = await db(); // Use your database connection function


    const combinations = await database.all(
      `SELECT * FROM combinations 
      WHERE 
        LOWER(card1) LIKE LOWER(?) OR 
        (LOWER(card1) LIKE LOWER(?)
        OR LOWER(card1) LIKE LOWER(?))

        OR
        LOWER(card2) LIKE LOWER(?) OR
        (LOWER(card2) LIKE LOWER(?)
        OR LOWER(card2) LIKE LOWER(?))
      `,
      [cardName, `%${cardName} (Onyx)`, `%${cardName} (Card)`, cardName, `%${cardName} (Onyx)`, `%${cardName} (Card)`]
    );

    for (var combo in combinations)
    {
      delete combinations[combo].id;
    }
    
    console.log(combinations);

    if (!combinations) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Respond with the retrieved card
    res.json(combinations);
    
  } catch (error) {
    console.error('Error fetching combinations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = router;
