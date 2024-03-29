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
        LOWER(full_name) LIKE LOWER(?) 
        OR LOWER(full_name) LIKE LOWER(?)
      `,
      [cardName, `%${cardName} (Card)`]
    );

    for(var card in cards)
    {
      const cardId = cards[card].id;
      const cardLevelStats = await database.all(
        `SELECT * FROM card_level_stats
        WHERE card_id = ?
        `,
        [cardId]
      );

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

router.get('/', async (req, res) => {
  try {
    const database = await db(); // Use your database connection function

    const cards = await database.all(
      `SELECT name, full_name, id, image_url, rarity, fusion FROM cards 
      `
    );

    

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
        LOWER(result) LIKE LOWER(?)
      `,
      [cardName, `%${cardName} (Card)`]
    );

    for (var recipe in recipes)
    {
      delete recipes[recipe].id;
    }
    

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
        LOWER(card1) LIKE LOWER(?) 
        OR LOWER(card1) LIKE LOWER(?)

        OR
        LOWER(card2) LIKE LOWER(?)
        OR LOWER(card2) LIKE LOWER(?)
      `,
      [cardName, `%${cardName} (Card)`, cardName, `%${cardName} (Card)`]
    );

    for (var combo in combinations)
    {
      delete combinations[combo].id;
    }
    
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

router.get('/fullcombos/:name', async (req, res) => {
  const cardName = req.params.name;

  try {
    const database = await db(); // Use your database connection function

    const combinations = await database.all(
      //combine the combo and the cards table to get the full card info
      `SELECT card1, card2, result, image_url as card1_image_url, rarity, form, fusion, result FROM combinations
      INNER JOIN cards
      ON combinations.card1 = cards.full_name
      WHERE 
        LOWER(card2) LIKE LOWER(?) 
        OR LOWER(card2) LIKE LOWER(?)
        OR LOWER(card1) LIKE LOWER(?)
        OR LOWER(card1) LIKE LOWER(?)`,
      [cardName, `%${cardName} (Card)`, cardName, `%${cardName} (Card)`]
    );

    for (var combo in combinations)
    {
      const cardResult = combinations[combo].result;
      let otherCard;

      otherCard = await database.get(
        `SELECT image_url FROM cards
        WHERE full_name = ?`,
        [combinations[combo].card2]
      );
    


      //get the image url from the result card
      const cardResultGetter = await database.get(
        `SELECT image_url FROM cards
        WHERE full_name = ?`,
        [cardResult]
      );

      delete combinations[combo].id;
      //get the card id from the result

      //get the result card's stats
      const cardGetter = await database.get(
        `SELECT id FROM cards
        WHERE full_name = ?
        `,
        [cardResult]
      );
      const cardLevelStats = await database.all(
        `SELECT * FROM card_level_stats
        WHERE card_id = ?
        `,
        [cardGetter.id]
      );

      for(var stat in cardLevelStats)
      {
        delete cardLevelStats[stat].id;
        delete cardLevelStats[stat].card_id;
      }
      
      //set the stats for return
      combinations[combo].card2_image_url = otherCard.image_url;
      combinations[combo].resultImage = cardResultGetter.image_url;
      combinations[combo].stats = cardLevelStats;
    }

    
    
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


router.get('/id/:id', async (req, res) => {

  try {
    const database = await db(); // Use your database connection function

    const cards = await database.all(
      `SELECT * FROM cards 
      WHERE 
        ID = ?
      `,
      [req.params.id]
    );

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



router.get('/onyx', async (req, res) => {
  try {
    const database = await db(); // Use your database connection function

    const cards = await database.all(
      `SELECT name, full_name, id, image_url, rarity, fusion FROM cards`
    );

    if (!cards) {
      return res.status(404).json({ error: 'Cards not found' });
    }

    // Respond with the retrieved card
    res.json(cards);
    
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
