'use strict';

function greetings() {
  return /^hi|hello|hey/i;
}

function funny() {
  return /^haha|kkk|lol/i;
}

function help() {
  return /^help|help me|helpme|menu/i;
}

function thanks() {
  return /^thanks|thank you|love you|love u/i;
}

function yesNo() {
  return /^yes|no|ok/i;
}

function howTheTestsAreGoingOn() {
  return /^how the tests are going?|are the tests ok?|how are the tests going|is the test going ok?|how is the tests going/i;
}

function winnerTest() {
  return /^which test win?|there is a winner?|winner test/i;
}

function rude() {
  return /^asshole|ass hole|fuck|fuck you|shit|pussy/i; 
}

function howToBuild() {
  return /^(build|how to build)/i;
}

function listLindTests() {
  return /^show [a-zA-Z]{1,2}\s[a-zA-Z]{1}/i;
}

function lindGenerateURL() {
  return /^url\s[a-zA-Z]{1,2}\s[a-zA-Z]{1,8}(\s[a-zA-Z])?/i;
}

function lindAudience() {
  return /^(%|audience)\s[a-zA-Z]{1,2}/i; 
}

function lindClearCache() {
  return /^(clear|clear\scache|cache)\s[a-zA-Z]{1,2}\s[a-zA-Z]{1,8}(\s[a-zA-Z])?/i;
}

function lindStatusCache() {
  return /^cache status \S+/i;
}

module.exports = {
	greetings: greetings,
	funny: funny,
	help: help,
	thanks: thanks,
	yesNo: yesNo,
	howTheTestsAreGoingOn: howTheTestsAreGoingOn,
	winnerTest: winnerTest,
	rude: rude,
	howToBuild: howToBuild,
	listLindTests: listLindTests,
	lindGenerateURL: lindGenerateURL,
	lindAudience: lindAudience,
	lindClearCache: lindClearCache,
	lindStatusCache: lindStatusCache
};