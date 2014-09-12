var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var levelNum = 6;
var colors = ["#000000", "#FF0000", "#9F00BF", "#38ADF2"];
//Normal block, death, bounce, water (NC) 
var bounceAmts = [5, 15];
//First is vertical, second is horizontal

var keys = {};
//Up:87  Down:83  Left:65  Right:68
//[keys.length - 1]
$(document).keydown(function (e) {
    keys[e.which] = true;
});

$(document).keyup(function (e) {
    delete keys[e.which];
});

//Basic level framework (layer):  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
var levels = [
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ], //basic level framework
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 1, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1]
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 4, 4, 3, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
];
//each block is 25x25, so 10 blocks high and 18 blocks wide
//enter level[i] to render whichever level
function renderLevel(level) {
    for (var i = 0; i < level.length; i++) {
        for (var j = 0; j < level[i].length; j++) {
            if (level[i][j] !== 0) {
                ctx.fillStyle = colors[level[i][j] - 1];
                ctx.fillRect(j * 25, i * 25, 25, 25);
            }
        }
    }
}

function Player(x, y, size, speed, maxSpeed, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.xv = 0;
    this.yv = 0;
    this.speed = speed;
    this.maxSpeed = maxSpeed;
    this.color = color;
    this.jumped = true;
}

function drawPlayer(player) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

//start x/y, height&width, acceleration, max vel, color hex
var user = new Player(canvas.width / 2, canvas.height / 2, 20, 0.1, 1, "#8A8A8A");
drawPlayer(user);

var surroundingBlocks;

function getSurroundingBlocks(right, down, num) {
    surroundingBlocks = [
        [
            [],
            [],
            []
        ],
        [
            [],
            [],
            []
        ],
        [
            [],
            [],
            []
        ]
    ];
    var listX;
    var listY;
    var nextX;
    var nextY;
    for (var k = 0; k < 3; k++) {
        for (var l = 0; l < 3; l++) {
            nextX = right + (25 * (l - 1));
            nextY = down + (25 * (k - 1));
            listX = nextX / 25;
            listY = nextY / 25;
            if (levels[num - 1][listY][listX] == 1) {
                surroundingBlocks[k][l] = [nextX, nextY];
            } else if (levels[num - 1][listY][listX] == 2) {
                surroundingBlocks[k][l] = [nextX, nextY, "!"];
            } else if (levels[num - 1][listY][listX] == 3) {
                surroundingBlocks[k][l] = [nextX, nextY, "bounce"];
            } else if (levels[num - 1][listY][listX] == 4) {
                surroundingBlocks[k][l] = [nextX, nextY, "water"];
            }
        }
    }
}

function checkVert() {
    var vert = false;
    for (var k = 0; k < 3; k++) {
        for (var l = 0; l < 3; l++) {
            if (k === 0) {
                if (user.y < surroundingBlocks[k][l][1] + 25 && surroundingBlocks[k][l].length !== 0) {
                    if (l === 0) {
                        if (user.x < surroundingBlocks[k][l][0] + 25) {
                            if (typeof (surroundingBlocks[k][l][2]) === 'undefined') {
                                vert = "up";
                            }
                            if (surroundingBlocks[k][l][2] == "!") {
                                vert = "death";
                            }
                            if (surroundingBlocks[k][l][2] == "bounce") {
                                vert = "b-up";
                            }
                        }
                    }
                    if (l == 2) {
                        if (user.x + user.size > surroundingBlocks[k][l][0]) {
                            if (typeof (surroundingBlocks[k][l][2]) === 'undefined') {
                                vert = "up";
                            }
                            if (surroundingBlocks[k][l][2] == "!") {
                                vert = "death";
                            }
                            if (surroundingBlocks[k][l][2] == "bounce") {
                                vert = "b-up";
                            }
                        }
                    }
                    if (l == 1) {
                        if (typeof (surroundingBlocks[k][l][2]) === 'undefined') {
                            vert = "up";
                        }
                        if (surroundingBlocks[k][l][2] == "!") {
                            vert = "death";
                        }
                        if (surroundingBlocks[k][l][2] == "bounce") {
                            vert = "b-up";
                        }
                    }
                }
            } else if (k == 2) {
                if (user.y + user.size > surroundingBlocks[k][l][1] && surroundingBlocks[k][l].length !== 0) {
                    if (l === 0) {
                        if (user.x < surroundingBlocks[k][l][0] + 25) {
                            if (typeof (surroundingBlocks[k][l][2]) === 'undefined') {
                                vert = "down";
                            }
                            if (surroundingBlocks[k][l][2] == "!") {
                                vert = "death";
                            }
                            if (surroundingBlocks[k][l][2] == "bounce") {
                                vert = "b-down";
                            }
                        }
                    }
                    if (l == 2) {
                        if (user.x + user.size > surroundingBlocks[k][l][0]) {
                            if (typeof (surroundingBlocks[k][l][2]) === 'undefined') {
                                vert = "down";
                            }
                            if (surroundingBlocks[k][l][2] == "!") {
                                vert = "death";
                            }
                            if (surroundingBlocks[k][l][2] == "bounce") {
                                vert = "b-down";
                            }
                        }
                    }
                    if (l == 1) {
                        if (typeof (surroundingBlocks[k][l][2]) === 'undefined') {
                            vert = "down";
                        }
                        if (surroundingBlocks[k][l][2] == "!") {
                            vert = "death";
                        }
                        if (surroundingBlocks[k][l][2] == "bounce") {
                            vert = "b-down";
                        }
                    }
                }
            }
        }
        if (k === 0) {
            k++;
        }
    }
    return vert;
}

function checkHoriz() {
    var horiz = false;
    for (var k = 0; k < 3; k++) {
        for (var l = 0; l < 3; l++) {
            if (l === 0) {
                if (user.x < surroundingBlocks[k][l][0] + 25 && surroundingBlocks[k][l].length !== 0) {
                    if (k === 0) {
                        if (user.y < surroundingBlocks[k][l][1] + 25) {
                            if (typeof (surroundingBlocks[k][l][2]) === 'undefined') {
                                horiz = "left";
                            }
                            if (surroundingBlocks[k][l][2] == "!") {
                                horiz = "death";
                            }
                            if (surroundingBlocks[k][l][2] == "bounce") {
                                horiz = "b-left";
                            }
                        }
                    }
                    if (k == 2) {
                        if (user.y + user.size > surroundingBlocks[k][l][1]) {
                            if (typeof (surroundingBlocks[k][l][2]) === 'undefined') {
                                horiz = "left";
                            }
                            if (surroundingBlocks[k][l][2] == "!") {
                                horiz = "death";
                            }
                            if (surroundingBlocks[k][l][2] == "bounce") {
                                horiz = "b-left";
                            }
                        }
                    }
                    if (k == 1) {
                        if (typeof (surroundingBlocks[k][l][2]) === 'undefined') {
                            horiz = "left";
                        }
                        if (surroundingBlocks[k][l][2] == "!") {
                            horiz = "death";
                        }
                        if (surroundingBlocks[k][l][2] == "bounce") {
                            horiz = "b-left";
                        }
                    }
                }
            } else if (l == 2) {
                if (user.x + user.size > surroundingBlocks[k][l][0] && surroundingBlocks[k][l].length !== 0) {
                    if (k === 0) {
                        if (user.y + user.size > surroundingBlocks[k][l][1]) {
                            if (typeof (surroundingBlocks[k][l][2]) === 'undefined') {
                                horiz = "right";
                            }
                            if (surroundingBlocks[k][l][2] == "!") {
                                horiz = "death";
                            }
                            if (surroundingBlocks[k][l][2] == "bounce") {
                                horiz = "b-right";
                            }
                        }
                    }
                    if (k == 2) {
                        if (user.y + user.size > surroundingBlocks[k][l][1]) {
                            if (typeof (surroundingBlocks[k][l][2]) === 'undefined') {
                                horiz = "right";
                            }
                            if (surroundingBlocks[k][l][2] == "!") {
                                horiz = "death";
                            }
                            if (surroundingBlocks[k][l][2] == "bounce") {
                                horiz = "b-right";
                            }
                        }
                    }
                    if (k == 1) {
                        if (typeof (surroundingBlocks[k][l][2]) === 'undefined') {
                            horiz = "right";
                        }
                        if (surroundingBlocks[k][l][2] == "!") {
                            horiz = "death";
                        }
                        if (surroundingBlocks[k][l][2] == "bounce") {
                            horiz = "b-right";
                        }
                    }
                }
            }
            if (l === 0) {
                l++;
            }
        }
    }
    return horiz;
}

function resetCharacter() {
    user.x = 225;
    user.y = 125;
    user.yv = 0;
    user.xv = 0;
}

function determineVert() {
    switch (checkVert()) {
        case "up":
            while (checkVert() == 'up') {
                user.y++;
            }
            user.yv *= -1;
            break;
        case "down":
            while (checkVert() == 'down') {
                user.y--;
            }
            if (determineCenter() != 'water') {
                user.yv = 1;
            }
            user.jumped = true;
            break;
        case "death":
            resetCharacter();
            break;
        case "b-up":
            user.yv = bounceAmts[0];
            break;
        case "b-down":
            user.yv = 0 - bounceAmts[0];
            break;
        case "water":
            user.yv -= 0.1;
            break;
        default:
            user.yv += 0.1;
    }
}

function determineHoriz() {
    switch (checkHoriz()) {
        case "left":
            while (checkHoriz() == 'left') {
                user.x++;
            }
            user.xv *= -1;
            break;
        case "right":
            while (checkHoriz() == 'right') {
                user.x--;
            }
            user.xv *= -1;
            break;
        case "death":
            resetCharacter();
            break;
        case "b-left":
            user.xv = bounceAmts[1];
            break;
        case "b-right":
            user.xv = 0 - bounceAmts[1];
            break;
        default:
            //Nothing!
    }
}


function determineCenter() {
    var touching = null;
    switch (surroundingBlocks[1][1][2]) {
        case "water":
            touching = 'water';
            user.yv -= 0.125;
            break;
        default:
            //nothing!
    }
    return touching;
}

$('#canvas').click(function () {
    console.log(surroundingBlocks[1][1]);
});

function detectCollision(level) {
    //will return left, right, up, down, or false
    var rX = Math.round(user.x / 25) * 25;
    var rY = Math.round(user.y / 25) * 25;
    getSurroundingBlocks(rX, rY, level);
    determineVert();
    determineHoriz();
    determineCenter();
}


function move() {
    drawPlayer(user);

    if (keys["83"] && !keys["87"]) {
        user.yv += 0.1;
    } else if (keys["87"] && !keys["83"]) {
        //user.yv -= user.speed;
        if (user.jumped) {
            user.yv = -3.75;

            user.jumped = false;
        } else if (determineCenter() == 'water') {
            user.yv -= 0.125;
        }
    }

    if (keys["65"] && !keys["68"]) {
        user.xv -= user.speed;
    } else if (keys["68"] && !keys["65"]) {
        user.xv += user.speed;
    }
    user.y += user.yv;
    user.x += user.xv;
    user.yv *= 0.98;
    user.xv *= 0.98;
    if (user.xv > user.maxSpeed) {
        user.xv = user.maxSpeed;
    }
    if (user.xv < 0 - user.maxSpeed) {
        user.xv = 0 - user.maxSpeed;
    }
    /*if (user.yv > user.maxSpeed) {
        user.yv = user.maxSpeed;
    }
    if (user.yv < 0 - user.maxSpeed) {
        user.yv = 0 - user.maxSpeed;
    }*/
    if (user.y > canvas.height || user.y < 0) {
        user.yv *= -1;
    }
    if (user.x > canvas.width || user.x < 0) {
        user.xv *= -1;
    }
}

function clear() {
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
setInterval(clear, 5);
setInterval(function () {
    renderLevel(levels[levelNum - 1]);
    move();
}, 5);
setInterval(function () {
    detectCollision(levelNum);
}, 5);
