'use strict';

var restify = require('restify'),
    builder = require('botbuilder'),
    bot = require('./bot'),
    netshoes = require('./netshoes'),
    nlp = require('./nlp');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var apiBot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

apiBot.dialog('/', new builder.IntentDialog()
    .matches(nlp.greetings(), function (session) {
      dialogInterceptor(session, bot.sendGreetings(session));
    })
    .matches(nlp.funny(), function (session) {
      dialogInterceptor(session, bot.sendFunny(session));
    })
    .matches(nlp.help(), function (session) {
      dialogInterceptor(session, bot.help(session));
    })
    .matches(nlp.thanks(), function (session) {
      dialogInterceptor(session, bot.thanks(session));
    })
    .matches(nlp.rude(), function (session) {
        bot.rude(session);
    })
    .matches(nlp.yesNo(), function (session) {
      dialogInterceptor(session, bot.yesNo(session));
    })
    .matches(nlp.howTheTestsAreGoingOn(), function (session) {
      dialogInterceptor(session, bot.howTheTestsAreGoingOn(session));
    })
    .matches(nlp.winnerTest(), function (session) {
      dialogInterceptor(session, bot.winnerTest(session));
    })
    .matches(nlp.howToBuild(), function (session) {
      dialogInterceptor(session, bot.howToBuild(session));
    })
    .matches(nlp.listLindTests(), function (session) {
      dialogInterceptor(session, netshoes.processLindRequest(session));
    })
    .matches(nlp.lindGenerateURL(), function (session) {
      dialogInterceptor(session, netshoes.generateLindURL(session));
    })
    .matches(nlp.lindAudience(), function (session) {
      dialogInterceptor(session, netshoes.getLindAudience(session));
    })
    .matches(nlp.lindClearCache(), function (session) {
      dialogInterceptor(session, netshoes.clearCache(session));
    })
    .matches(nlp.lindStatusCache(), function (session) {
      dialogInterceptor(session, netshoes.cacheStatus(session));
    })
    .onDefault(function (session) {
      dialogInterceptor(session, bot.sendCommonMessage(session));
    })
);

apiBot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, "Hi! I'm **LindBot**. A Bot for helping in common Lind tasks. What is your name?");
    },
    function (session, results) {
      session.userData.name = results.response;
      bot.sendCommonMessage(session, results);
    }
]);

function dialogInterceptor(session, callback) {
  if(!session.userData.name) {
    session.beginDialog('/profile'); 
  } else {
    callback;
  }
}