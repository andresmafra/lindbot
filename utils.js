'use strict';

var _ = require('lodash');

function zeroPad(str) {
  return ('0' + parseInt(str)).slice(-2);
}

function extractMessage(message, position) {
  return _.split(_.trim(message), ' ')[position];
}

function getLindUrl(store, platform, isHmg) {
  if(store === 'ns') {
    if(platform === 'desktop') {
      return isHmg ? process.env.LINDD_HMG_NS : process.env.LINDD_NS;
    } else if(platform === 'mobile') {
      return isHmg ? process.env.LINDM_HMG_NS : process.env.LINDM_NS;
    }
  } else if(store === 'zt') {
    if(platform === 'desktop') {
      return isHmg ? process.env.LINDD_HMG_ZT : process.env.LINDD_ZT;
    } else if(platform === 'mobile') {
      return isHmg ? process.env.LINDM_HMG_ZT : process.env.LINDM_ZT;
    }
  }
  return;
}

module.exports = {
	zeroPad: zeroPad,
	extractMessage: extractMessage,
	getLindUrl: getLindUrl
}