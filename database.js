//database sqlite3

"use strict"

class BulletDatabase {
  
  constructor() {
    const databaseFile = "database/bullet.db";
    this.exists = require('fs').existsSync(databaseFile);
    this.db = new (require('sqlite3').verbose()).Database(databaseFile);
  }

  init() {
    this.db.run(
      'CREATE TABLE IF NOT EXISTS files (' +
        'fileName TEXT PRIMARY KEY, ' +
        'title TEXT' +
      ')'
    );
  }
}

//   var statement = db.prepare("INSERT INTO bullet VALUES (?, ?)");

//   statement.run(["Number " + 23, 1]);
//   // statement.run("Number " + 14, 2);
//   // statement.run("Number " + 50, 4);
//   // statement.run("Thing #" + 69, 8);
//   // statement.run("Thing #" + 78, 16);
//   statement.finalize();

//   db.each("SELECT rowid AS id, comment, time FROM bullet", function(err, row) {
//     console.log(row.id + ": " + row.comment + " " + row.time);
//   });


// db.close();

module.exports = BulletDatabase;
