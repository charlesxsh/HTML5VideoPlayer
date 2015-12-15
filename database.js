//database sqlite3

"use strict"

class BulletDatabase {
  
  constructor() {
    const databaseFile = "database/bullet.db";
    //existsSync deprecated
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

  //SELECT * FROM files
  selectAllVideoInfoAndSend(res) {
    this.db.all("SELECT rowid AS id, fileName, title FROM files", function(err, rows) {
      if (err) throw err;
      if(rows.length > 0) {
        console.log(rows);
        var videoEntries = [];
        for(var i = 0; i < rows.length; i++) {
          videoEntries.push({fileName: rows[i].fileName, title: rows[i].title});
          console.log(rows[i]);
        }
        res.end(JSON.stringify(videoEntries));
      }
    });
  }

  selectAllBulletFromVideoAndSend(res, videoFileName) {
    this.db.all("SELECT comment, time FROM "+videoFileName, function(err, rows) {
      if(err) throw err;
      res.end(JSON.stringify(rows));
    });
  }

  //msg: the bullet massage
  insertNewBullet(msg) {
    //TODO: should check for err
    this.db.run("INSERT INTO "+ msg.videoFileName +" VALUES ($comment, $time)", {
      $comment: msg.comment,
      $time: msg.time
    });
  }

  insertNewVideoFile(videoFileName, videoTitle) {
    //TODO: should check for err
    this.db.run("INSERT INTO files VALUES ('"+ videoFileName +"','"+ videoTitle +"')");
  }

  //use the videoFileName as the table name for a bullet table that is associated with this video file
  createNewBulletTable(videoFileName) {
    //TODO: should check for err
    this.db.run(
      "CREATE TABLE IF NOT EXISTS "+videoFileName+" ("+
        "comment TEXT, " +
        "time INT" +
      ")"
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
