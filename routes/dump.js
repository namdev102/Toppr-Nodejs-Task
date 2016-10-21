var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var fs = require('fs');

// database name-> toppr and collection name -> got
mongoose.connect('mongodb://localhost/toppr');
var conn = mongoose.connection;

var Converter = require("csvtojson").Converter;
var converter = new Converter({});

//read from file
require("fs").createReadStream("./battles.csv").pipe(converter);

converter.on("end_parsed", function (jsonArray) {
  //  dumping data into database
  conn.collection('got').insert(jsonArray);

  // writing data to be dumped in the text file jsonData.text
  fs.writeFile("./jsonData.json", JSON.stringify({jsonArray}), function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
});
});

module.exports = router;
