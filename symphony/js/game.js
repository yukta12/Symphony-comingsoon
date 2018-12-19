(function () {
    var canvas, ctx, grid, move;
    var movement = 0;
    var ySpeed = 20;
    var blackTileIndex;
    var score = 0;
    var isPlaying = false;

    //var canvasWidth = canvas.width;
    //var canvasHeight = canvas.height;

    var init = function () {
        canvas = document.querySelector('#canvas');
        ctx = canvas.getContext('2d');

        grid = makeGrid(4, 4, 300 / 4, 550 / 4);
    };

    var Tile = function (x, y, width, height, color, stroke) {
        // width => x+endX
        // height => y+endY
        return {
            x: x,
            y: y,
            width: width,
            height: height,
            color: color,
            stroke: stroke,
            draw: function () {
                if (this.stroke) {
                    ctx.strokeStyle = this.color
                    ctx.lineWidth = 1;

                    ctx.clearRect(this.x, this.y, this.x + this.width, this.y + this.height);

                    ctx.strokeRect(this.x, this.y, this.x + this.width, this.y + this.height);

                } else {
                    ctx.fillStyle = this.color;

                    ctx.fillRect(this.x, this.y, this.x + this.width, this.y + this.height);
                }
            },
            clear: function () {
                ctx.clearRect(this.x, this.y, this.x + this.width, this.y + this.height);
            },
            isHit: function (_event) {
                if (this.x < _event.clientX && (this.x + this.width) > _event.clientX && this.y < _event.clientY && (this.y + this.height) > _event.clientY) {
                    return true;
                } else {
                    return false;
                }
            }
        };
    };

    var makeGrid = function (rows, columns, horDist, verDist) {
        var rects = [];

        for (var j = 0; j < rows; j++) {

            var blackNum = Math.floor(Math.random() * (columns - 1 - 0 + 1)) + 0
            for (var i = 0; i < columns; i++) {
                var tempTile;
                if (blackNum !== i) {
                    rects.push(new Tile(i * horDist, j * verDist, i * horDist + horDist, j * verDist + verDist, '#000000', true));

                } else {
                    rects.push(new Tile(i * horDist, j * verDist, i * horDist + horDist, j * verDist + verDist, '#000000', false));
                }
            }
        }
        return rects;
    }

    var replaceTiles = function (newGrid) {
        for (var i = newGrid.length - 1; i >= 0; i--) {
            grid.unshift(newGrid[i]);
        }
        grid = grid.splice(0, 16);
    };

    var drawGrid = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var k = 0; k < grid.length; k++) {
            grid[k].draw();
        }
    };

    var clearGrid = function () {
        for (var i = 0; i < grid.length; i++) {
            grid[i].clear();
        }
    };

    function countdown() {
        var time = 60;



        var timer = setInterval(function () {
            if (!isPlaying) {
                return;
            }

            if (time > 0 && isPlaying) {
                time--;
                document.getElementById("score-count").innerHTML = (score < 10) ? "000" + score : (score > 10 && score < 100) ? "00" + score : (score > 100 && score < 1000) ? "0" + score : score;
                document.getElementById("minutes_timer").innerHTML = "00";
                document.getElementById("seconds_timer").innerHTML = (time >= 10) ? time + "" : "0" + time;
            } else {

                
                alert("Time's up!");
                clearInterval(timer);
                return;
            }

        }, 1000);

    };

    var moveGridY = function (val) {
        movement += val;
        if (movement >= 550 / 4 && movement >= 300 / 4 )  { 
            move = false;
            movement = 0;
            replaceTiles(makeGrid(1, 4, 300 / 4, 550 / 4)); 
        } else {
            for (var i = 0; i < grid.length; i++) {
                grid[i].y += val;
            }
        }
    };

    var update = function () {
        if (move) {
            moveGridY(ySpeed);
        }
    };

    var render = function () {
        drawGrid();
    };

    function timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    };

    var now, dt,
        last = timestamp();

    function frame() {
        now = timestamp();
        dt = (now - last) / 1000;
        update(dt);
        render(dt);
        last = now;
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);

    init();

    for (var i = 0; i < grid.length; i++) {
        console.log(grid[i].x + ' ' + grid[i].y + ' ' + grid[i].stroke)
        if (i >= 12 && !grid[i].stroke) {
            blackTileIndex = i - 12
        }
        console.log(blackTileIndex)
    }

    $(window).on('load resize', function () {
        if ($(window).width() < 950) { //mobile
    

            canvas.addEventListener('click', function (_event) {
                isPlaying = true;
                countdown();
                for (var i = 0; i < grid.length; i++) {
                    if (grid[i].isHit(_event) && !grid[i].stroke) {
                        move = true;
                        score++;
                    } else {
                        if (grid[i].isHit(_event) && grid[i].stroke) {
                            alert('Game over');
                             window.location.reload();
                            isPlaying = false;
                            score = 0;
                           
                        }
                    }
                }
            });
        } else { //desktop
            alert("To play the game, press q,w,e,r for the 4 tiles respectively")

            window.addEventListener('keydown', function (_event) {
                var tempIndex;
                if (!isPlaying) {
                    countdown();
                }
                isPlaying = true;
                for (var i = 12; i < grid.length; i++) {
                    if (!grid[i].stroke) {
                        blackTileIndex = i - 12;
                    }
                }
                console.log(_event.key + ' ' + blackTileIndex);
                if (_event.key === 'q') {
                    tempIndex = 0;
                } else if (_event.key === 'w') {
                    tempIndex = 1;
                } else if (_event.key === 'e') {
                    tempIndex = 2;
                } else if (_event.key === 'r') {
                    tempIndex = 3;
                }
                if (blackTileIndex === tempIndex && !grid[tempIndex + 12].stroke) {
                    move = true;
                    score++;
                } else {
                    if (_event.key == 'q' || _event.key == 'w' || _event.key == 'e' || _event.key == 'r')
                        alert('Game over');
                    isPlaying = false;
                    score = 0;
                }
                for (var i = 0; i < grid.length; i++) {
                    console.log(grid[i].x + ' ' + grid[i].y + ' ' + grid[i].stroke)
                    console.log(blackTileIndex)
                }
            });
        }
    });

})();
