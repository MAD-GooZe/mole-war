function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var wormPos = me.whereIsWorm();
var dx = wormPos.x - me.x;
var dy = wormPos.y - me.y;

function doIHaveWorm(){
    return (me.x == wormPos.x) && (me.y == wormPos.y);
}

var directions = ["up", "left", "down", "right"];
for (var i = 0; i < directions.length; i++){
    if (me.whatIs(directions[i]) == "mole" && getRandomInt(0, 3) == 0){
        me.hit(directions[i]);
        break;
    }
}

if (doIHaveWorm() && (getRandomInt(0, 1) == 0 || me.whoIsNear().length == 1)){
    me.eat();
} else {
    var direction;

    if (Math.abs(dx) > Math.abs(dy)){
        if (dx > 0){
            direction = "right";
        } else {
            direction = "left";
        }
    } else {
        if (dy > 0){
            direction = "down";
        } else {
            direction = "up";
        }
    }

    var canMove = (me.whatIs(direction) != "stone") && (me.whatIs(direction) != "mole");

    if (!canMove) {
        if ((direction == "up") || (direction == "down")){
            direction = ["left", "right"][getRandomInt(0, 1)];
        } else if ((direction == "left") || (direction == "right")){
            direction = ["up", "down"][getRandomInt(0, 1)];
        }
    }

    me.move(direction);
}
