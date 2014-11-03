var fs = require('fs');
var async = require('async');
var range = require('range');
var Strategy = require('./strategy.js');
var jade = require("jade");
var strategyCommands = require('./strategyCommands.js');


var STONE_PROBABILITY = 0.05;
var MAP_SIZE = 16;
var WORM_SIZE = 20;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMap(size){

    var map = [];
    for (var x = 0; x < size; x++){
        map.push([]);
        for (var y = 0; y < size; y++){

            if (Math.random() <= STONE_PROBABILITY){
                map[x].push("s");
            } else {
                map[x].push(" ");
            }

        }
    }
    return map;
}


module.exports = function(strategyFiles, maxMoves){

    var self = this;
    self.move = 0;

    self.map = generateMap(MAP_SIZE);
    self.maps = [];
    self._log = [[], []];
    self.wormX = [];
    self.wormY = [];

    self.log = function(str){
        self._log[self._log.length - 1].push(str);
        console.log(str);
    };
    self.nextLog = function () {
        self._log.push([]);
    };

    var strategies = [
        new Strategy(fs.readFileSync(strategyFiles[0]), 0, 0),
        new Strategy(fs.readFileSync(strategyFiles[1]), 0, self.map.length - 1),
        new Strategy(fs.readFileSync(strategyFiles[2]), self.map.length - 1, 0),
        new Strategy(fs.readFileSync(strategyFiles[3]), self.map.length - 1, self.map.length -1)
    ];
    for (var i = 0; i < strategyFiles.length; i++){
        self.map[strategies[i].x][strategies[i].y] = String(i);
    }
    self.worm = {
        size: WORM_SIZE,
        x: Math.round(self.map.length / 2 + getRandomInt(- self.map.length / 6, self.map.length / 6)),
        y: Math.round(self.map.length / 2 + getRandomInt(- self.map.length / 6, self.map.length / 6))
    };
    self.map[self.worm.x][self.worm.y] = "w";

    var canMove = function(strategy, stepX, stepY){
        if (!self.map[strategy.x + stepX]){
            return false;
        } else {
            var cell = self.map[strategy.x + stepX][strategy.y + stepY];
            return cell === ' ' || cell === 'w';
        }
    };

    self.printMap = function(){
        for (var y = 0; y < self.map.length; y++) {
            var str = "";
            for (var x = 0; x < self.map.length; x++){
                str += self.map[x][y];
            }
            console.log(str);
        }
    };

    self.renderHTML = function(filename){
        var html = jade.renderFile('./views/result.jade', {
            maps: self.maps,
            logs: self._log,
            wormX: self.wormX,
            wormY: self.wormY
        });
        fs.writeFileSync(filename, html);
    };


    var commandMove = function(strategy, stepX, stepY){
        var newX = strategy.x + stepX;
        var newY = strategy.y + stepY;

        if (!canMove(strategy, stepX, stepY)){
            self.log(strategy.stringId + " tried to move to " + newX + " " + newY);
            return;
        }

        self.map[strategy.x][strategy.y] = ' ';
        var whatWasInCell = self.map[newX][newY];
        self.map[newX][newY] = strategy.id;
        if (whatWasInCell == 'w'){
            strategy.worm = self.worm;
            self.log(strategy.stringId + " has taken the worm");
        }

        strategy.x = newX;
        strategy.y = newY;
        if (strategy.worm){
            strategy.worm.x = newX;
            strategy.worm.y = newY;
        }

        self.log(strategy.stringId + " moved to " + newX + " " + newY);
    };


    var commandHit = function(strategy, stepX, stepY){
        if (self.map[strategy.x + stepX]){
            var whatWasInCell = self.map[strategy.x + stepX][strategy.y + stepY];
            if (!isNaN (whatWasInCell) && !(whatWasInCell === ' ') /* it's actually a mole*/){
                var mole = strategies[Number(whatWasInCell)];
                mole.active = false;
                self.log(strategy.stringId + " hits " + mole.stringId + " so that it is stunned for the next turn");
                if (mole.worm){
                    strategy.worm = mole.worm;
                    mole.worm = undefined;
                    self.log(strategy.stringId + " has taken the worm from " + mole.stringId);
                }
            } else {
                self.log(strategy.stringId + " attempts to hit not a mole");
            }
        }
    };


    var commandEat = function(strategy){
        if (strategy.worm){
            strategy.wormEaten += 1;
            self.worm.size--;
            self.log(strategy.stringId + " has eaten a meter of worm; worm is now " + self.worm.size + " meters");
        }
    };


    var runCommands = function(strategy, output){
        var canMove = true;
        var canEat = true;
        var canHit = true;

        for (var i = 0; i < output.length; ++i){
            var nextLine = String(output[i]);
            if (nextLine.length == 0)  continue;
            if (nextLine[0] != '@'){
                self.log(strategy.stringId + nextLine);
                continue;
            }
            var nextCommand = nextLine.substring(1);

            if (nextCommand == strategyCommands.up && canMove){
                canMove = false;
                canEat = false;
                commandMove(strategy, 0, -1);
            } else if (nextCommand == strategyCommands.down && canMove){
                canMove = false;
                canEat = false;
                commandMove(strategy, 0,  1);
            } else if (nextCommand == strategyCommands.left && canMove){
                canMove = false;
                canEat = false;
                commandMove(strategy, -1, 0);
            } else if (nextCommand == strategyCommands.right && canMove){
                canMove = true;
                canEat = true;
                commandMove(strategy, 1,  0);
            }

            else if (nextCommand == strategyCommands.hitUp && canHit){
                canHit = false;
                canEat = false;
                commandHit(strategy, 0, -1);
            } else if (nextCommand == strategyCommands.hitDown && canHit){
                canHit = false;
                canEat = false;
                commandHit(strategy, 0,  1);
            } else if (nextCommand == strategyCommands.hitLeft && canHit){
                canHit = false;
                canEat = false;
                commandHit(strategy, -1, 0);
            } else if (nextCommand == strategyCommands.hitRight && canHit){
                canHit = false;
                canEat = false;
                commandHit(strategy, 1,  0);
            } else if (nextCommand == strategyCommands.eat && canEat){
                canEat = false;
                canMove = false;
                canHit = false;
                commandEat(strategy);
            }
        }
    };


    self.play = function(gameEndCallback){
        self.maps.push(clone(self.map));
        async.mapSeries(range(maxMoves), function(move, moveCallback){
            console.log("Move #" + move);
            async.mapSeries(
                range(strategies.length),
                function(i, stepCallback){
                    strategies[i].run({
                        strategy:{x:strategies[i].x, y:strategies[i].y},
                        map:self.map,
                        worm:self.worm,
                        commands: strategyCommands,
                        memory:strategies[i].memory,
                        active: strategies[i].active
                    }, function(result){

                        if (!strategies[i].active){
                            self.log(strategies[i].stringId + " skips its turn as it is stunned");
                            strategies[i].active = true;
                        } else {
                            var nextStrategy = strategies[i];
                            nextStrategy.id = i;
                            nextStrategy.stringId = "mole#" + i + ": ";
                            runCommands(nextStrategy, result.console);
                        }

                        self.maps.push(clone(self.map));
                        self.wormX.push(self.worm.x);
                        self.wormY.push(self.worm.y);
                        self.nextLog();

                        if (!self.isEnded()) {
                            stepCallback();
                        } else {
                            if (gameEndCallback)
                                gameEndCallback();
                        }
                    });
                },
                function(){
                    self.move++;
                    moveCallback();
                }
            );

        }, function(){
            if (gameEndCallback)
                gameEndCallback();
        });

    };

    self.isEnded = function(){
        return self.worm.size <= 0;
    };
};



function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}