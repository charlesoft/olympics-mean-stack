"use strict";

let express = require('express');
let app = express();

let mongoUtil = require('./mongoUtil');
mongoUtil.connect();

app.use(express.static(__dirname+"/../client"));

let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();

app.get("/sports", function(request,response){
  let sports = mongoUtil.sports();
  sports.find().toArray(function(err,docs){
    if(err){
      response.sendStatus(400);
    }

    console.log(JSON.stringify(docs));
    let sportsNames = docs.map((sport) => sport.name);

    console.log(sportsNames);
    response.json(sportsNames);
  });
});

app.get('/sports/:name', function(request,response){
  let sportsName = request.params.name;

  let sports = mongoUtil.sports();
  sports.find({name: sportsName}).limit(1).next((err,doc) => {
    if(err){
      response.sendStatus(400);
    }
    console.log("Sport doc: ", doc);
    response.json(doc);
  });
});

app.post('/sports/:name/medals',jsonParser,function(request, response){
  let sportsName = request.params.name;
  let newMedal = request.body.medal || {};
  let query = {name: sportsName};
  let update = {$push:{goldMedals: newMedal}};

  if(!newMedal.division || !newMedal.year || !newMedal.country){
    response.sendStatus(400);
  }

  let sports = mongoUtil.sports();
  sports.findOneAndUpdate(query,update,(err,res) => {
    if(err){
      response.sendStatus(400);
    }
    response.sendStatus(201);
    console.log("result", res);
  });
});

app.listen(8181, function(){
  console.log("Listening on 8181");
});
