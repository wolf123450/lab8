var express = require('express');
var bodyParser = require('body-parser');

var basicAuth = require('basic-auth-connect');
var auth = basicAuth(function(user, pass) {
    return((user ==='cs360')&&(pass === 'test'));
  });

var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var MongoClient = require('mongodb').MongoClient;
var app = express();


// app.use(bodyParser());
// app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var options = {
    host: '127.0.0.1',
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt')
};
http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
// app.get('/', function (req, res) {
//     res.send("Get Index");
// });

app.use('/', express.static('./html', {maxAge: 60*60*1000}));

app.get('/getcity', function (req, res) {
    var urlObj = url.parse(req.url, true, false);
    // console.log("In getcity route");
    // res.json([{city:"Price"},{city:"Provo"}]);
    fs.readFile("cities.dat.txt", function(err,data){
        if (err) throw err;
        var myRe = new RegExp("^"+urlObj.query.q);
        //console.log(myRe);
        var ret = [];
        var cities = data.toString().split("\n");

        for (var i in cities){
        var result = cities[i].search(myRe);
        if (result != -1) {
          ret.push({city: cities[i]});
        }
        }
        console.log(JSON.stringify(ret));
        res.writeHead(200);

        res.end(JSON.stringify(ret));
  });
});

app.get('/comment', function (req, res) {
    var urlObj = url.parse(req.url, true, false);
    // console.log("In comment route");
    // res.status(200)
    // res.end();
    console.log("comment route");
    console.log("In GET");
    MongoClient.connect("mongodb://localhost/weather", function(err, db) {
    if (err) throw err;
    db.collection("comments", function(err, comments) {
      if (err) throw err;
      comments.find(function(err, items) {
        items.toArray(function(err, itemArr) {
          console.log("Document Array: ");
          console.log(itemArr);
          // res.writeHead(200);
          res.json(itemArr);
          // res.end(JSON.stringify(itemArr));
        });
      });
    });
    });
});

app.post('/comment', auth, function (req, res) {
    var urlObj = url.parse(req.url, true, false);
    // console.log("In POST comment route");
    console.log(req.body);
    // res.status(200);
    // res.end();
    console.log("POST comment route");
    // var reqObj = JSON.parse(jsonData);
    var reqObj = req.body;
    console.log(reqObj);
    console.log("Name: " + reqObj.Name);
    console.log("Comment: "+reqObj.Comment);
    MongoClient.connect("mongodb://localhost/weather", function(err,db) {
        if (err) throw err;
        db.collection('comments').insert(reqObj, function(err, records) {
            console.log("Record added as "+ records[0]._id);
            res.writeHead(200);
            res.end("");
        });
    });

    // var jsonData = "";
    // req.on('data', function(chunk) {
    //     jsonData += chunk;
    // });

    // req.on('end', function(){
    //     console.log('end');
    //     var reqObj = JSON.parse(jsonData);
    //     console.log(reqObj);
    //     console.log("Name: " + reqObj.Name);
    //     console.log("Comment: "+reqObj.Comment);
    //     MongoClient.connect("mongodb://localhost/weather", function(err,db) {
    //         if (err) throw err;
    //         db.collection('comments').insert(reqObj, function(err, records) {
    //             console.log("Record added as "+ records[0]._id);
    //             res.writeHead(200);
    //             res.end("");
    //         });
    //     });
    // });
});