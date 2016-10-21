var express = require('express');
var router = express.Router();
var fs = require('fs');

var obj;
fs.readFile('./jsonData.json', 'utf8', function (err, data) {
  if (err) throw err;
  obj = JSON.parse(data);
});


// end point to get places data
router.get('/list',function(req,res) {
  var place = places();
  res.json(place);
});

//end point to get count of places data
router.get('/count',function(req,res) {
  var location = 0, region =0;
  for(var i=0;i<obj.jsonArray.length;i++) {
    if(obj.jsonArray[i].location)
      location++;
      if(obj.jsonArray[i].region)
        region++;
  }
  res.json({
    no_of_locations: location,
    no_of_regions: region
  });
})

//end point to get stats on the provided data
router.get('/stats',function(req,res) {
  var name = mostFrequentName();
  var attacker = mostFrequentAttackerKing();
  var defender = mostFrequentDefenderKing();
  var place = mostFrequentPlaces();
    res.json({
      most_frequent_name:name,
      most_frequent_attacker_king:attacker,
      most_frequent_defender_king:defender,
      most_frequent_location:place.location,
      most_frequent_region:place.region
    });
})

// end point to return results based on search query
router.get('/search', function(req,res) {
  var final = [];
  var result = obj;
  var name = req.query.q;
  // console.log(req.query);
  var nameQuery='';
  if(name)
    nameQuery = new RegExp('^' + name, 'i');
  var k=0;
  for(var i=0;i<result.jsonArray.length;i++) {
    if(nameQuery.test(result.jsonArray[i].name)) {
      final[k++] = result.jsonArray[i];
    }
  }
  res.json(final);
})

function places() {
  var list = [];
  for(var i=0;i<obj.jsonArray.length;i++) {
    var location = '';
    var region = '';
    if(obj.jsonArray[i].hasOwnProperty('location'))
      location = obj.jsonArray[i].location;
    if(obj.jsonArray[i].hasOwnProperty('region'))
      region = obj.jsonArray[i].region;
    list[i]= {
        location,
        region
    };
  }
  return list;
}

function mostFrequentName() {
  var name = {};
    var maxName = obj.jsonArray[0].name, maxNameCount = 1;
    for(var i = 0; i < obj.jsonArray.length; i++)
    {
    	var el = obj.jsonArray[i].name;
    	if(name[el] == null)
    		name[el] = 1;
    	else
    		name[el]++;
    	if(name[el] > maxNameCount)
    	{
    		maxName = el;
    		maxCount = name[el];
    	}
    }
    return maxName;
}

function mostFrequentAttackerKing() {
  var attacker = {};
    var maxAttacker = obj.jsonArray[0].attacker_king, maxAttackCount = 1;
    for(var i = 0; i < obj.jsonArray.length; i++)
    {
    	var el = obj.jsonArray[i].attacker_king;
    	if(attacker[el] == null)
    		attacker[el] = 1;
    	else
    		attacker[el]++;
    	if(attacker[el] > maxAttackCount)
    	{
    		maxAttacker = el;
    		maxAttackCount = attacker[el];
    	}
    }
    return maxAttacker;
}

function mostFrequentDefenderKing() {
  var defender = {};
    var maxDefender = obj.jsonArray[0].defender_king, maxDefendCount = 1;
    for(var i = 0; i < obj.jsonArray.length; i++)
    {
    	var el = obj.jsonArray[i].defender_king;
    	if(defender[el] == null)
    		defender[el] = 1;
    	else
    		defender[el]++;
    	if(defender[el] > maxDefendCount)
    	{
    		maxDefender = el;
    		maxDefendCount = defender[el];
    	}
    }
    return maxDefender;
}

function mostFrequentPlaces() {
  var list = places();
  var region = {}, location = {};
    var maxRegion = list[0].region, maxRegionCount = 1, maxLocation = list[0].location, maxLocationCount=1;
    for(var i = 0; i < list.length; i++)
    {
    	var el = list[i].region;
    	if(region[el] == null)
    		region[el] = 1;
    	else
    		region[el]++;
    	if(region[el] > maxRegionCount)
    	{
    		maxRegion = el;
    		maxRegionCount = region[el];
    	}
      var el1 = list[i].location;
    	if(location[el] == null)
    		location[el1] = 1;
    	else
    		location[el1]++;
    	if(location[el1] > maxLocationCount)
    	{
    		maxLocation = el1;
    		maxLocationCount = location[el1];
    	}
    }
    return {
      location:maxLocation,
      region:maxRegion
    };
}


module.exports = router;
