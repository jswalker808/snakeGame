window.onload = function() {
  let myCanvas = document.getElementById("canvas");
  let ctx = myCanvas.getContext("2d");
  let snake = [];
  let initSnakeLength = 10;
  let snakeSize = 20;
  let startx = 240;
  let starty = 200;
  let direction = '';
  let intervalId = '';
  let goinUp = true;
  let goinLeft = false;
  let newHeadY = '';
  let newHeadX = '';
  let gameSpeed = 450;
  let boundaryX = 500;
  let boundaryY = 500;
  let gameOver = false;

  function game() {
    // setInterval(chooseDirection, gameSpeed);
    // console.log("in game function");
    intervalId = setInterval(moveUp, gameSpeed);
    direction = 'up';
    chooseDirection();
  }

    function chooseDirection() {
        document.onkeydown = function(e) {
          if (gameOver === false) {
            if (e.keyCode == '87') {
              if (direction != 'up' && direction != 'down') {
                stopInterval();
                direction = 'up';
                goinUp = true;
                intervalId = setInterval(moveUp, gameSpeed);
              }
            }
            else if (e.keyCode == '83') {
              if (direction != 'up' && direction != 'down') {
                stopInterval();
                direction = 'down';
                goinUp = false;
                intervalId = setInterval(moveDown, gameSpeed);
              }
            }
            else if (e.keyCode == '65') {
              if (direction !== 'left' && direction !== 'right') {
                stopInterval();
                intervalId = setInterval(moveLeft, gameSpeed);
                direction = 'left';
              }
            }
            else if (e.keyCode == '68') {
              if (direction !== 'right' && direction !== 'left') {
                stopInterval();
                intervalId = setInterval(moveRight, gameSpeed);
                direction = 'right';
              }
            }
          }
        }
    }
    function checkBoundary() {
      console.log("x-value: " + snake[0].x);
      console.log("y-value: " + snake[0].y);
        if (snake[0].y > 480 || snake[0].y < 0 || snake[0].x > 480 || snake[0].x < 0) {
          clearInterval(intervalId);
          gameOver = true;
          console.log(gameOver);
        }
    }
    function stopInterval() {
      clearInterval(intervalId);
      intervalId = '';
    }
    function drawSnakeComponent(x, y, size) {
      ctx.fillStyle = "green";
      ctx.fillRect(x, y, size, size);
      ctx.stroke();
    }
    function buildInitSnake() {
      for (let i = 0; i < initSnakeLength; i++) {
        // console.log(starty);
        drawSnakeComponent(startx, starty, snakeSize);
        let snakeComp = {x: startx, y: starty};
        snake.push(snakeComp);
        starty += snakeSize;
      }
    }
    function removeHead() {
      console.log(snake);
      ctx.clearRect(snake[0].x, snake[0].y, snakeSize, snakeSize);
      snake.shift();
    }
    function removeTail() {
      ctx.clearRect(snake[snake.length - 1].x, snake[snake.length - 1].y, snakeSize, snakeSize);
      snake.pop();
    }
    function drawNewHead(x, y) {
      snake.unshift({x: x, y: y});
      drawSnakeComponent(snake[0].x, snake[0].y, snakeSize);
    }
    function drawNewTail(x, y) {
      snake.push({x: x, y: y});
      drawSnakeComponent(snake[snake.length-1].x, snake[snake.length-1].y, snakeSize);
    }
    function moveUp() {
      if (goinUp) {
        removeTail();
        newHeadY = snake[0].y - snakeSize;
        newHeadX = snake[0].x;
        drawNewHead(newHeadX, newHeadY);
      }
      checkBoundary();
    }
    function moveLeft() {
      newHeadY = snake[0].y;
      newHeadX = snake[0].x - snakeSize;
      removeTail();
      drawNewHead(newHeadX, newHeadY);
      checkBoundary();
    }
    function moveDown() {
      removeTail();
      newHeadY = snake[0].y + snakeSize;
      newHeadX = snake[0].x;
      drawNewHead(newHeadX, newHeadY);
      checkBoundary();
    }
    function moveRight() {
      newHeadY = snake[0].y;
      newHeadX = snake[0].x + snakeSize;
      removeTail();
      drawNewHead(newHeadX, newHeadY);
      checkBoundary();
    }

  buildInitSnake();
  game();
  // document.addEventListener("keydown", keyPush);
};
