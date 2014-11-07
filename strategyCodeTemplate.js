function _run(parameters){
    var strObject = new StrategyObject(parameters.map, parameters.worm, parameters.strategy, parameters.commands, parameters.memory);
    run(strObject);
    return strObject.memory;
}

function run(me){
    try {
        INSERT_STRATEGY_CODE_HERE;
    } catch (err){
        saveToLog("Error: "+ err.message);
    }
}


var StrategyObject = function(map, worm, strategy, strategyCommands, lastMemory){
    var self = this;

    self.memory = lastMemory;

    self.say = saveToLog;

    self.moveUp = function() {
        saveToLog("@" + strategyCommands.up);
    };
    self.moveDown = function() {
        saveToLog("@" + strategyCommands.down);
    };
    self.moveLeft = function() {
        saveToLog("@" + strategyCommands.left);
    };
    self.moveRight = function() {
        saveToLog("@" + strategyCommands.right);
    };

    self.hitUp = function() {
        saveToLog("@" + strategyCommands.hitUp);
    };
    self.hitDown = function() {
        saveToLog("@" + strategyCommands.hitDown);
    };
    self.hitLeft = function() {
        saveToLog("@" + strategyCommands.hitLeft);
    };
    self.hitRight = function() {
        saveToLog("@" + strategyCommands.hitRight);
    };

    var whatIs = function(cellX, cellY){
        if (!map[cellX])        return "stone";
        var cellInMap =  map[cellX][cellY];
        if (cellInMap === ' ')  return 'ground';
        if (!isNaN(cellInMap))  return 'mole';
        if (!cellInMap)         return 'stone';
        if (cellInMap == 's')   return 'stone';
        if (cellInMap == 'w')   return 'worm';
        return 'err';
    };
    self.whatIsDown = function(){
        return whatIs(strategy.x, strategy.y + 1);
    };
    self.whatIsLeft = function(){
        return whatIs(strategy.x - 1, strategy.y);
    };
    self.whatIsRight = function(){
        return whatIs(strategy.x + 1, strategy.y);
    };

    self.whatIsUp = function() {
        return whatIs(strategy.x, strategy.y - 1);
    };

    self.x = strategy.x;
    self.y = strategy.y;

    self.whereIsWorm = function(){
        return {x:worm.x, y:worm.y}
    };

    self.whoIsNear = function(){
        var moles = [];

        var length = 2;
        for (var i = strategy.x - length; i <= strategy.x + length; ++i){
            for (var j = strategy.y - length; j <= strategy.y + length; ++j){
                if (whatIs(i, j) == 'mole'){
                    moles.push({x:i, y:j});
                }
            }
        }

        return moles;
    };

    self.eat = function (){
        saveToLog("@" + strategyCommands.eat);
    };

    self.move = function(direction){
        var moveFunctions = {};
        moveFunctions["up"]    = self.moveUp;
        moveFunctions["down"]  = self.moveDown;
        moveFunctions["right"] = self.moveRight;
        moveFunctions["left"]  = self.moveLeft;

        var moveFunction = moveFunctions[direction];
        if (moveFunction){
            moveFunction();
        }
    };

    self.whatIs = function(direction){
        var whatIsFunctions = {};
        whatIsFunctions["up"]    = self.whatIsUp;
        whatIsFunctions["down"]  = self.whatIsDown;
        whatIsFunctions["right"] = self.whatIsRight;
        whatIsFunctions["left"]  = self.whatIsLeft;

        var whatIsFunction = whatIsFunctions[direction];
        if (whatIsFunction){
            return whatIsFunction();
        }

        return "err";
    };

    self.hit = function(direction){
        var hitFunctions = {};
        hitFunctions["up"]    = self.hitUp;
        hitFunctions["down"]  = self.hitDown;
        hitFunctions["right"] = self.hitRight;
        hitFunctions["left"]  = self.hitLeft;

        var hitFunction = hitFunctions[direction];
        if (hitFunction){
            hitFunction();
        }
    };
};