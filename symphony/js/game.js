(function() {
  var canvas, ctx, grid, move;
  var movement = 0;
  var ySpeed = 20;
  
  var init = function() {
    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');
    grid = makeGrid(4, 4, 112.5, 150);
  };
  
  
  var Tile = function(x, y, width, height, color, stroke) {   
    // width => x+endX
    // height => y+endY
    return {
      x: x,
      y: y,
      width: width,
      height: height,
      color: color,
      stroke: stroke,
      draw: function() {
        if(this.stroke) {
          ctx.strokeStyle = this.color
          ctx.lineWidth = 1;
          
          ctx.clearRect(this.x, this.y, this.x+this.width, this.y+this.height);
          
          ctx.strokeRect(this.x, this.y, this.x+this.width, this.y+this.height);
          
        } else {
          ctx.fillStyle = this.color;
        
          ctx.fillRect(this.x, this.y, this.x+this.width, this.y+this.height);
        }
      },
      clear: function() {
         ctx.clearRect(this.x, this.y, this.x+this.width, this.y+this.height);
      },
      isHit: function(_event) {
        if(this.x < _event.clientX && (this.x+this.width) > _event.clientX && this.y < _event.clientY && (this.y+this.height) > _event.clientY) {
          return true;
        } else {
          return false;
        }
      }
    };
  };
  
  var makeGrid = function(rows, columns, horDist, verDist) {
    var rects = [];
    
    for(var j = 0; j < rows; j++) {
      
      var blackNum = Math.floor(Math.random() * (columns-1 - 0 + 1)) + 0
      
      for(var i = 0; i < columns; i++) {
        var tempTile;
        if(blackNum !== i) {
          rects.push(new Tile(i*horDist, j*verDist, i*horDist+horDist, j*verDist+verDist, '#000000', true));
        } else {
          rects.push(new Tile(i*horDist, j*verDist, i*horDist+horDist, j*verDist+verDist, '#000000', false));
        }
      }
    }
    return rects;
  }
  
  var replaceTiles = function(newGrid) {
    for(var i = newGrid.length-1; i >= 0; i--) {
      grid.unshift(newGrid[i]);
    }
    grid = grid.splice(0, 16);
  };
  
  var drawGrid = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(var k = 0; k < grid.length; k++) {
      grid[k].draw();
    }
  };
  
  var clearGrid = function() {
    for(var i = 0; i < grid.length; i++) {
      grid[i].clear();
    }
  };
  
  var moveGridY = function(val) {
    movement += val;
    if(movement >= 150) {
      move = false;
      movement = 0;
      replaceTiles(makeGrid(1, 4, 112.5, 150));
    } else {
      for(var i = 0; i < grid.length; i++) {
        grid[i].y += val;
      }
    }
  };
  
  var update = function() {
    if(move) {
      moveGridY(ySpeed);
    }
  };
  
  var render = function() {
    drawGrid();
  };
  
  function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  };
  
  var now, dt,
    last = timestamp();

  function frame() {
    now   = timestamp();
    dt    = (now - last) / 1000;
     console.log(dt);
    update(dt);
    render(dt);
    last = now;
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
  
  init();
  
  canvas.addEventListener('click', function(_event) {
     for(var i = 0; i < grid.length; i++) {
       if(grid[i].isHit(_event) && !grid[i].stroke) {
         move = true;
       }
     }
  });
  
})();