const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function openDb() {
  const dbPath = path.join(__dirname, 'card_database.db');

  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

module.exports = openDb;