'use strict';

var _ = require('lodash'),
    utils = require('./utils'),
    netshoes = require('./netshoes');

function sendCommonMessage(session) {
  session.send("Hey **%s**. I'm glad that you are here. I can help you in some tasks:", session.userData.name);
  session.send(menuMessage());
  session.send("Anytime you can type **help** for help ;)");
  session.endDialog();
}

function sendGreetings(session) {
  var messages = ["Hi there! How is going?", "Hey, wassup?", "I'm here", "Hi! It's hot today, isn't it??", "Hi! I think today is too much cold, isn't it?"];
  session.send(messages[_.random(0, 4)]);
}

function menuMessage() {
  var menu = "1) List tests available on Lind (type **show ns desktop** or **show zt mobile hmg** *[for hmg test]*)\n\n";
  menu += "2) Generate Lind test URLs (type **url ns desktop** or **url zt mobile hmg** *[for hmg test]*) \n\n";
  menu += "3) Get Lind audience in use (type **% zt** or **audience ns**)\n\n";
  menu += "4) Clear Lind statics Akamai cache (type **cache ns desktop** or **cache zt mobile hmg** *[for hmg files]*)\n\n";
  menu += "5) Status of Akamai cache clear (type **cache status *purgeId* **)\n\n";
  menu += "6) Help for running Grunt (for Devs :nerd_face:) (type **build**)\n\n";
  return menu;
}

function sendFunny(session) {
  var messages = [":laughing:", ":yum:", ":joy:"];
  session.send(messages[_.random(0, 2)]);
}

function help(session) {
  session.send("Hey **%s**, do you wanna help ?", session.userData.name);
  session.send(menuMessage());
}

function thanks(session) {
  var messages = ["You're welcome :wave:", ":hearts:", ":+1:", ":kissing_heart:"];
  session.send(messages[_.random(0, 3)]);
}

function yesNo(session) {
  var messages = [":ok_hand:", ":v:"];
  session.send(messages[_.random(0, 1)]);
}

function howTheTestsAreGoingOn(session) {
  session.send("https://www.youtube.com/watch?v=VX3lz5ph8A0");
}

function winnerTest(session) {
  session.send("https://www.youtube.com/watch?v=RjY2gpcBb3A");
}

function howToBuild(session) {
  var howTo = "**For running:** \n\n*grunt desktop --store=netshoes* \n\n*grunt mobile --store=zattini* \n\n **For build:**\n\n *grunt build --store=netshoes*";
  session.send(howTo);
}

function rude(session) {
  var messages = [":fuck:", ":middle_finger:", "fuck you :middle_finger: !"];
  session.send(messages[_.random(0, 2)]);
}

module.exports = {
	menuMessage: menuMessage,
	sendGreetings: sendGreetings,
	sendCommonMessage: sendCommonMessage,
	sendFunny: sendFunny,
	help: help,
	thanks: thanks,
	yesNo: yesNo,
	howTheTestsAreGoingOn: howTheTestsAreGoingOn,
	winnerTest: winnerTest,
	howToBuild: howToBuild,
	rude: rude
};