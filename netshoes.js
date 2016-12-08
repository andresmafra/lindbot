'use strict';

var request = require('request'),
    _ = require('lodash'),
    utils = require('./utils'),
    akamai = require('./akamai');

function processLindRequest(session) {
  var store = utils.extractMessage(session.message.text, 1),
      platform = utils.extractMessage(session.message.text, 2),
      isHmg = utils.extractMessage(session.message.text, 3) === 'hmg',
      lindUrl = utils.getLindUrl(store.toLowerCase(), platform.toLowerCase(), isHmg);

  if(!lindUrl) {
    session.send("Couldn't find a suitable Lind url. Can you check your request? You said: '" + session.message.text + "'");
  } else {
      getLindData(lindUrl, function(err, response, body) {
        var lindObject = getLindObject(body);
      	if(lindObject) {
          session.send("This are the tests running on *" + store + "* for platform *" + platform + "* :runner:");
      	  _.each(lindObject, function(testData) {
      	    var variationMessage = "";
      	    _.each(_.tail(testData.variations), function(testVariations) {
      	      variationMessage += "Variation **" + testVariations.name + "** of this test is setup with an audience of **" + testVariations.audience + "%** \n\n";
      	    });
      	    session.send("The test **" + testData.testName.name + "** is setup with an audience of **" + testData.testName.audience + "%** \n\n" + variationMessage);
      	  });
      	  
      	} else {
      	  session.send("No tests were found for store '" + store + "' and platform '" + platform + "'");
      	}
      });
  }
  
}

function getLindObject(body) {
  
  var testsWithAudience = /[name:"[a-zA-Z0-9]*"*,audience:\d{1,3}]*/g,
        	    testsWithVariation = /(,|;){1}[a-z]{1}\.[a-zA-Z0-9]*="(\d|\d\,\d)"/g,
        	    testsWithAudienceList = body.match(testsWithAudience),
        	    testsWithVariationList = body.match(testsWithVariation),
        	    variationGroup = [];
        	
	if(testsWithVariationList && testsWithVariationList.length > 0) {
	  _.each(testsWithVariationList, function(testVariationUnit) {
	    var testVariationSplit = _.split(testVariationUnit.replace(/(,|;){1}[a-z]{1}\./g, "").replace("\"", "").replace("\"", ""), '=');
	    variationGroup.push({
	      name: testVariationSplit[0],
	      group: _.split(testVariationSplit[1], ",")[0]
	    });
	  });
	  
	  variationGroup = _.chain(variationGroup).groupBy('group').map(function(v, i) {
	    var mappedVariations = [];
	    _.each(v, function(variation) {
	      mappedVariations.push({
	        name: variation.name
	      });
	    });
      return {
	      group: parseInt(i),
	      testName: _.head(mappedVariations),
	      variations: mappedVariations
	    };
    }).value();
	}
	
	if(testsWithAudienceList && testsWithAudienceList.length > 0) {
  	return _.chain(variationGroup).sortBy('group').map(function(k, i) {
  	   var mappedTest = _.clone(k);
  	   _.each(testsWithAudienceList, function(testAudienceUnit) {
  	     var nameAudienceMap = testAudienceUnit.replace(/name:/g, "").replace(/audience:/g, "").replace(/"/g, "").split(",");
  	     _.each(mappedTest.variations, function(vars) {
  	       if(vars.name === nameAudienceMap[0]) {
  	         vars.audience = nameAudienceMap[1];
  	       }
  	     });
  	   });
  	   return mappedTest;
  	 }).value();
	}
}


function getLindData(url, callback) {
    request({
    uri: url,
    method: 'GET'
  }, callback);
}

function generateLindURL(session) {
  var store = utils.extractMessage(session.message.text, 1),
      platform = utils.extractMessage(session.message.text, 2),
      isHmg = utils.extractMessage(session.message.text, 3) === 'hmg',
      lindUrl = utils.getLindUrl(store.toLowerCase(), platform, isHmg);
  
  getLindData(lindUrl, function(err, response, body) {
    var lindObject = getLindObject(body);
    if(lindObject && lindObject.length > 0) {
      session.send("One sec while I'm preparing those urls for you... ");
      _.each(lindObject, function(testObj) {
        var varMessage = "";
        session.send("The variations for test **" + testObj.testName.name + "** are:");
        _.each(_.slice(testObj.variations, 1), function(variationObj) {
          var preUrl = (store === 'zt' ? process.env.LIND_ZT_FORCE : process.env.LIND_NS_FORCE);
          varMessage += preUrl + "test=" + testObj.testName.name + "_" + variationObj.name + "_" + Math.floor(Date.now() / 1000) + (isHmg ? '&hmg=1' : '') + "\n\n";
        });
        session.send(varMessage);
      });
    } else {
      session.send("I couldn't find any test running with your request :neutral_face:");
    }
  });
}

function getLindAudience(session) {
  var store = utils.extractMessage(session.message.text, 1);

  getLindData(utils.getLindUrl(store.toLowerCase(), 'desktop'), function(err, response, body) {
    var lindObject = getLindObject(body);
    if(lindObject && lindObject.length > 0) {
      var totalAudience = 0;
      _.each(lindObject, function(testData) {
        totalAudience += parseInt(testData.testName.audience);
      });
      session.send("The total audience for *desktop* tests on *" + store + "* is **" + totalAudience + "%** \n\nSo, the remaining audience is **" + (100 - totalAudience) + "%**");
    } else {
      session.send("No tests are running for *desktop* on *" + store+ "*");
    }
  });
  
  getLindData(utils.getLindUrl(store.toLowerCase(), 'mobile'), function(err, response, body) {
    var lindObject = getLindObject(body);
    if(lindObject && lindObject.length > 0) {
      var totalAudience = 0;
      _.each(lindObject, function(testData) {
        totalAudience += parseInt(testData.testName.audience);
      });
      session.send("The total audience for *mobile* tests on *" + store + "* is **" + totalAudience + "%** \n\nSo, the remaining audience is **" + (100 - totalAudience) + "%**");
    } else {
      session.send("No tests are running for *mobile* on *" + store+ "*");
    }
  });
    
}

function clearCache(session) {
  var store = utils.extractMessage(session.message.text, 1),
    platform = utils.extractMessage(session.message.text, 2),
    isHmg = utils.extractMessage(session.message.text, 3) === 'hmg',
    errorMessage = "Ops! I couldn't request to Akamai clear the cache :disappointed:. You can try again later.";
  
  akamai.clearAkamaiCache(store, platform, isHmg, function(err, response, body) {
    if(!err) {
      var result = JSON.parse(body),
          message = "";
      if(result.httpStatus === 201) {
        message = "I've requested to Akamai to clear this cache.\n\n";
        message += "The estimated time to complete is **" + (result.estimatedSeconds / 60) + "** minute(s).\n\n";
        message += "Your Akamai *purgeId* is **" + result.purgeId + "**";
        
        message += "\n\n \n\n";
        message += "If you wanna see the clearing status, run:\n\n";
        message += "**cache status " + result.purgeId + "**";
        
        session.send(message);
      } else {
        session.send(errorMessage);
      }
    } else {
      session.send(errorMessage);
    }
  });
}

function cacheStatus(session) {
  var purgeId = utils.extractMessage(session.message.text, 2);
  
  akamai.getPurgeStatus(purgeId, function(err, response, body) {
    if(!err) {
      var result = JSON.parse(body);
      session.send("The status of cache clear is **" + result.purgeStatus + "**.");
    }
  });
  
}

module.exports = {
	processLindRequest: processLindRequest,
	generateLindURL: generateLindURL,
	getLindAudience: getLindAudience,
	clearCache: clearCache,
	cacheStatus: cacheStatus
};