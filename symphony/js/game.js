function _(id) {
    return document.getElementById(id);
}

var min = 0,
    sec = 0;
var config = {
    playing: false,
    isGameOver: false,
    cols: 4,
    rows: 4,
    width: 300,
    height: 500,
    speed: 7,
    tile: {
        border: 1,
        color: {
            default: "#FFE252",
            clicked: "#E6BE3A",
            unclicked: "#000",
            wrong: "red"
        }
    },
    gameInterval: null,
    score: 0,
    maxScore: 0,
    accent: "#F80C3A",
    font: "bold 40px monospace",
    fontNormal: "bold 20px monospace",
    intervalTime: 40,
    incrementSpeedAfterTile: 10
};

function tileObject() {
    this.width = config.width / config.cols;
    this.height = config.height / config.rows;
    this.x = 0;
    this.y = 0;
    this.bgColor = config.tile.color.default;
    this.borderColor = "#000";
    this.border = 1;
    this.clickable = false;
    this.isClicked = false;
    this.row = 0;
    this.col = 0;
}

function init() {
    
    tileHolder = [];
    var halfRow = Math.round(config.rows / 2);
    var startTile = null;
    for (var i = 0; i < config.rows + 2; i++) {
        var selectedRandomTile = false;
        for (var j = 0; j < (config.cols); j++) {
            var tile = new tileObject();
            tile.x = tile.width * j;
            tile.y = config.height - tile.height * i;
            tile.row = i;
            tile.col = j;
            if (!selectedRandomTile) {

                if (
                    (Math.ceil(Math.random() * 5) == 2) ||
                    j == config.cols - 1
                ) {

                    selectedRandomTile = true;
                    /*
                     * Make starting some tile unclickable for game
                     */
                    if (i >= halfRow) {

                        if (startTile == null) {
                            startTile = tile;
                        }

                        makeTileClickable(tile);
                    }

                }
            }

            tileHolder.push(tile);
        }
    }
    draw();
    drawStartTile(startTile);

}

 var x = document.getElementById("myAudio");

    function playAudio() {
        x.play();
    }


function makeTileClickable(tile) {
    tile.clickable = true;
    tile.isClicked = false;
    tile.bgColor = config.tile.color.unclicked;
}

function draw() {

    if (config.playing) {
        moveToNextFrame();
    }
    var c = _("gameCanvas").getContext('2d');
    c.clearRect(0, 0, config.width, config.height);
    for (var i = 0; i < tileHolder.length; i++) {
        var tempTile = tileHolder[i];
        drawTile(tempTile);
    }



}

function drawTile(tempTile) {
    var c = _("gameCanvas").getContext('2d');
    c.fillStyle = tempTile.borderColor;
    c.fillRect(tempTile.x, tempTile.y, tempTile.width, tempTile.height);
    c.fillStyle = tempTile.bgColor;
    c.fillRect(tempTile.x + tempTile.border, tempTile.y + tempTile.border,
        tempTile.width - tempTile.border, tempTile.height - tempTile.border);
    c.fill();
}


function moveToNextFrame() {
    var len = tileHolder.length;
    var maxPosition = getMaxRowPosition();
    var tempTileHolder = [];
    for (var i = 0; i < len; i++) {
        var tempTile = tileHolder[i];

        //Check if clickable tile has reached to end
        //i.e. Game Over
        if (tempTile.clickable) {
            if (!tempTile.isClicked) {
                if (tempTile.y + tempTile.height + config.speed >= config.height) {

                    tempTile.bgColor = config.tile.color.wrong;
                    gameOver();
                }
            }
        }

        if (tempTile.y > config.height) {
            //Remove Tile and add new tile or reset existing tile
            tempTile.y = maxPosition - tempTile.height;
            resetTileExceptXYPosition(tempTile);
            tempTileHolder.push(tempTile);

        }
        tempTile.y += config.speed;
    }

    if (tempTileHolder.length > 0) {
        var randomeNumber = Math.ceil(Math.random() * config.cols - 1);

        makeTileClickable(tempTileHolder[randomeNumber]);
    }

}

function resetTileExceptXYPosition(tile) {
    var y = tile.y;
    var x = tile.x;
    var tempTile = new tileObject();
    for (var k in tempTile) {
        tile[k] = tempTile[k];
    }
    tile.y = y;
    tile.x = x;
}

function getMaxRowPosition() {
    var len = tileHolder.length;
    var maxTile = null;
    for (var i = 0; i < len; i += config.cols) {
        var tempTile = tileHolder[i];
        if (maxTile == null) {
            maxTile = tempTile;
        } else if (maxTile.y > tempTile.y) {
            maxTile = tempTile;
        }
    }
    return maxTile.y;
}

function draw() {

    if (config.playing) {
        moveToNextFrame();
    }
    var c = _("gameCanvas").getContext('2d');
    c.clearRect(0, 0, config.width, config.height);
    for (var i = 0; i < tileHolder.length; i++) {
        var tempTile = tileHolder[i];
        drawTile(tempTile);
    }
}

var updateTimeScore;

function startGame() {
    config.playing = true;
    config.gameInterval = setInterval(draw, 50);
    /*min=0,sec=0;
    updateTimeScore = setInterval(()=>{
        sec++;
        min += Math.floor(sec/60);
        sec = sec%60;

        //document.getElementById("minutes_timer").innerHTML=(min>=10) ? min : "0"+min;
        //document.getElementById("seconds_timer").innerHTML=(sec>=10) ? sec : "0"+sec;
    }
    ,1000);*/
}

function gameOver() {
    clearInterval(updateTimeScore);
    config.isGameOver = true;
    config.playing = false;

    config.score = 0;
    clearInterval(config.gameInterval);
    var c = _("gameCanvas").getContext('2d');

    c.font = config.font;
    c.fillStyle = config.accent;
    c.textAlign = "center";
    c.fillText("Game Over", config.width / 2, 150);
    //var img = _("replay");

    //c.drawImage(img, config.width / 2 - 30, config.height - 50 - 30, 60, 60);

}

function getTileInPosition(coords) {
    var x = coords.x;
    var y = coords.y;
    var len = tileHolder.length;

    for (var i = 0; i < len; i++) {
        var tempTile = tileHolder[i];
        if (x > tempTile.x && x < tempTile.x + tempTile.width) {
            if (y > tempTile.y && y < tempTile.y + tempTile.height) {
                return tempTile;
            }
        }
    }
    return null;

}

function gameMouseClick(e) {

    if (config.isGameOver) {
        init();
        config.isGameOver = false;
        return;
    } else {
        if (!config.playing) {
            startGame();
        }
    }

    var x = e.clientX - _("gameCanvas").offsetLeft + window.scrollX;
    var y = e.clientY - _("gameCanvas").offsetTop + window.scrollY;

    var clickedTile = getTileInPosition({
        x: x,
        y: y
    });

    if (clickedTile != null) {
        if (clickedTile.clickable) {
            if (!clickedTile.isClicked) {
                // console.log("Nice!");
                clickedTile.isClicked = true;
                clickedTile.bgColor = config.tile.color.clicked;
                config.score++;
                playAudio();
                //                            var count = config.score;
            } else {
                clickedTile.bgColor = config.tile.color.wrong;
                drawTile(clickedTile);
                gameOver();
            }
        } else {
            clickedTile.bgColor = config.tile.color.wrong;
            drawTile(clickedTile);
            gameOver();
        }
    } else {
        console.log("Tile Not Found");
    }
}


function drawText(c) {
    c.font = config.font;
    c.fillStyle = config.accent;
    c.textAlign = "center";
    c.fillText(config.score, config.width / 2, 30);
}


function controleSpeed() {
    var num = config.incrementSpeedAfterTile;
    if (config.score % num == num - 1) {
        var speed = config.intervalTime - 5 * Math.round(config.score / num);
        if (speed < 5) {
            speed = 5;
        } else {
            clearInterval(config.gameInterval);
            config.gameInterval = setInterval(draw, speed);
        }
    }
}

function draw() {

    if (config.playing) {
        moveToNextFrame();
    }


    var c = _("gameCanvas").getContext('2d');

    c.clearRect(0, 0, config.width, config.height);

    for (var i = 0; i < tileHolder.length; i++) {
        var tempTile = tileHolder[i];
        drawTile(tempTile);
    }

    drawText(c);
    controleSpeed();
}


function drawStartTile(tile) {
    var c = _("gameCanvas").getContext('2d');
    c.font = config.fontNormal;
    c.fillStyle = config.tile.color.default;
    c.textAlign = "center";
    c.textBaseline = "middle";
    var x = tile.x + tile.width / 2;
    var y = tile.y + tile.height / 2;
    c.fillText("Start", x, y);
}

window.onload = function () {
    init();
   

}
