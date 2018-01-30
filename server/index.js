const express = require('express')
const app = express()
const port = 3000

app.get('/getcheckins', (request, response) => {
        
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";

        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("openpoi");
          var query = null;
          if ("user" in request.query) {
            query = { user: parseInt(request.query.user) };
            console.log("user id query");
          } else if("poi" in request.query) {
            query = { poi: parseInt(request.query.poi) };
            console.log("poi id query");
          }
          dbo.collection("checkins").aggregate([
             {
                $match: query
             },
             { $lookup:
               {
                 from: 'users',
                 localField: 'user',
                 foreignField: 'id',
                 as: 'userdetails'
               }
             }
          ]).toArray(function(err, result) {
            if (err) throw err;
            response.setHeader('content-type', 'text/javascript');
            //console.log(result)
            response.send(JSON.stringify({result}));
            db.close();
         });
        });
})

app.get('/addcheckin', (request, response) => {
        
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";

        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("openpoi");
          var query = { poi: parseInt(request.query.poi), user: parseInt(request.query.user), ts: Date() };
          
          dbo.collection("checkins").insertOne(query, function(err, result) {
            if (err) throw err;
            response.setHeader('content-type', 'text/javascript');
            console.log(result);
            response.json(result);
            db.close();
         });
        });
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
