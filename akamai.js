'use strict';

var request = require('request'),
    utils = require('./utils');
    
function clearAkamaiCache(store, platform, isHmg, callback) {
  
  var body = {
    objects: [utils.getLindUrl(store, platform, isHmg)]
  };
  
  request({
    uri: process.env.AKAMAI_API_URL,
    method: 'POST',
    headers: {
      "Authorization": "Basic " + process.env.AKAMAI_AUTHORIZATION,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }, callback);

}

function getPurgeStatus(purgeId, callback) {
  request({
    uri: process.env.AKAMAI_API_PURGE_STATUS_URL + purgeId,
    method: 'GET',
    headers: {
      "Authorization": "Basic " + process.env.AKAMAI_AUTHORIZATION,
      "Content-Type": "application/json"
    }
  }, callback);
  
}

module.exports = {
  clearAkamaiCache: clearAkamaiCache,
  getPurgeStatus: getPurgeStatus
};