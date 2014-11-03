var Sandbox = require('sandbox');
var strategyCommands = require('./strategyCommands.js');
var strategyCodeTemplate = String(require("fs").readFileSync("./strategyCodeTemplate.js"));

module.exports = function(strategyCode, x, y, timeout){
    var self = this;

    strategyCode = strategyCodeTemplate.replace("INSERT_STRATEGY_CODE_HERE", strategyCode);
    self.x = x;
    self.y = y;
    self.active = true;
    self.wormEaten = 0;
    self.memory = {};

    self.run = function(parameters, callback){
        var processConsoleForMemory = function(result){
            var sandboxConsole = result.console;
            if (sandboxConsole.length > 0){
                self.memory = JSON.parse(sandboxConsole.pop());
            }

            callback(result);
        };

        self.sandbox = new Sandbox();
        self.sandbox.options.timeout = timeout || 10000;

        if (parameters.active){
            self.sandbox.run(strategyCode, processConsoleForMemory);
            self.sandbox.postMessage(JSON.stringify(parameters));
        } else {
            callback();
        }
    }
};
