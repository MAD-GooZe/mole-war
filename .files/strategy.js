var strategyCommands = require('./strategyCommands.js');
var strategyCodeTemplate = String(require("fs").readFileSync("./strategyCodeTemplate.js"));

module.exports = function(strategyCode, x, y, timeout){
    var self = this;

    strategyCode = strategyCodeTemplate.replace("INSERT_STRATEGY_CODE_HERE", strategyCode);
    self.x = x;
    self.y = y;
    self.active = true;
    self.wormEaten = 0;
    var memory = {};

    var result;
    eval(strategyCode);

    self.run = function(parameters, callback){

        parameters.memory = memory;
        parameters.strategy = {
            x: self.x,
            y: self.y
        };

        if (self.active){
            clearResult();
            memory = _run(parameters);
            callback(result);
        } else {
            callback();
        }
    };

    function clearResult(){
        result = {result: 'null', console: []};
    }
    var saveToLog = function (){
        result.console.push(Array.prototype.slice.call(arguments).join(" "));
    };
};


