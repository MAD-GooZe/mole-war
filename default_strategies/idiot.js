function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


me.memory.whereIHaveBeen = me.memory.whereIHaveBeen || [];
me.memory.whereIHaveBeen.push ({x: me.x, y: me.y});

var moveCoords = {};
moveCoords['up']    = {x:  0,  y: -1};
moveCoords['down']  = {x:  0,  y:  1};
moveCoords['right'] = {x:  1,  y:  0};
moveCoords['left']  = {x: -1,  y:  0};

var directions = ['up', 'down', 'right', 'left'];
var canMoveTo = [];

for (var j = 0; j < directions.length; ++j){
    var canMove = true;
    var testX = me.x + moveCoords[directions[j]].x;
    var testY = me.y + moveCoords[directions[j]].y;

    if (me.whatIs(directions[j]) != "ground" && me.whatIs(directions[j]) != "worm"){
        canMove = false;
    } else {
        for (var i = 0; i < me.memory.whereIHaveBeen.length; ++i){
            if (me.memory.whereIHaveBeen[i].x === testX && me.memory.whereIHaveBeen[i].y === testY){
                canMove = false;
                break;
            }
        }
    }

    if (canMove){
        canMoveTo.push(directions[j]);
    }
}

if (canMoveTo.length > 0){
    var direction = canMoveTo[getRandomInt(0, canMoveTo.length-1)];
    me.move(direction);
} else {
    me.moveRight();
}
