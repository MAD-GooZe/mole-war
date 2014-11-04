#!/usr/bin/env node

var stdio = require('stdio');
var Game = require('./game.js');
var async = require('async');
var range = require('range');
var Strategy = require('./strategy.js');


console.log(process.argv.length);
if (process.argv.length == 2)
    process.argv = ["", "", "-o", "result.html", "-s", "test", "idiot", "idiot", "clever", "-r", "1", "-m", "50"];

var options = stdio.getopt({
    'strategies': {key: 's', args: 4, description: 'Strategies to compare (.js files)', mandatory: true},
    'output': {key: 'o', args: 1, description: 'Output results into specified html file'},
    'rounds': {key: 'r', args: 1, description: 'How many times the battle is run, default: 1'},
    'maxMoves': {key: 'm', args: 1, description: 'Maximum moves in each game, default: 100'}
});

var defaultStrategies = {
    "idiot": "./default_strategies/idiot.js",
    "idle": "./default_strategies/idle.js",
    "clever": "./default_strategies/clever.js",
    "test": "./test.js"
};

for (var i = 0; i < options.strategies.length; i++){
    if (defaultStrategies[options.strategies[i]])
        options.strategies[i] = defaultStrategies[options.strategies[i]];
}

options.rounds = options.rounds || 1;
options.maxMoves = options.maxMoves || 100;

async.mapSeries(range(options.rounds), function(round, callback){
    var game = new Game(options.strategies, options.maxMoves);
    game.play(function(results){
        //console.log("Player " + game.winner + " wins round " + round);
        game.renderHTML(options.output);
        callback();
    });
});
