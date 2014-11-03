function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var action = getRandomInt(0, 3);
if (action == 0)
    me.moveUp();
if (action == 1)
    me.moveDown();
if (action == 2)
    me.moveLeft();
if (action == 3)
    me.moveRight();
