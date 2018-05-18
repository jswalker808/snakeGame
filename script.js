window.onload = function() {
  let myCanvas = document.getElementById("canvas");
  let ctx = myCanvas.getContext("2d");
  let snake = [];
  let initSnakeLength = 8;
  let snakeSize = 20;
  let startx = 240;
  let starty = 200;
  let foodX = 0;
  let foodY = 0;
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
  let foodDrawn = false;

  function game() {
    // setInterval(chooseDirection, gameSpeed);
    // console.log("in game function");
    generateRandomXY();
    drawFood(foodX, foodY, snakeSize, snakeSize);
    buildInitSnake();
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
      // console.log("x-value: " + snake[0].x);
      // console.log("y-value: " + snake[0].y);
      if (snake[0].y > 480 || snake[0].y < 0 || snake[0].x > 480 || snake[0].x < 0) {
        clearInterval(intervalId);
        gameOver = true;
        console.log(gameOver);
      }
    }
    function checkSnakeHit() {
      // console.log("x-value: " + snake[0].x);
      // console.log("y-value: " + snake[0].y);
      // console.log("---------------------");
      for (let i = 1; i < snake.length; i++) {
        if ((snake[0].y === snake[i].y) && (snake[0].x === snake[i].x)) {
          clearInterval(intervalId);
          gameOver = true;
          console.log(gameOver);
        }
      }
    }
    function checkFoodHit() {
      // console.log("x-value: " + snake[0].x);
      // console.log("y-value: " + snake[0].y);
      // console.log("---------------------");
      if ((snake[0].y === foodY) && (snake[0].x === foodX)) {
        drawNewHead(newHeadX, newHeadY);
        foodDrawn = false;
        generateRandomXY();
        drawFood(foodX, foodY, snakeSize, snakeSize);
        console.log(snake.length);
        increaseSpeed();
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
    function drawFood(x, y, size) {
      if (!foodDrawn) {
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, size, size);
        ctx.stroke();
        foodDrawn = true;
        console.log("food was drawn!");
        console.log(foodX);
        console.log(foodY);
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
      // drawSnakeComponent(snake[snake.length-1].x, snake[snake.length-1].y, snakeSize);
    }
    function moveUp() {
      if (goinUp) {
        removeTail();
        newHeadY = snake[0].y - snakeSize;
        newHeadX = snake[0].x;
        drawNewHead(newHeadX, newHeadY);
      }
      checkBoundary();
      checkSnakeHit();
      checkFoodHit()
    }
    function moveLeft() {
      newHeadY = snake[0].y;
      newHeadX = snake[0].x - snakeSize;
      removeTail();
      drawNewHead(newHeadX, newHeadY);
      checkBoundary();
      checkSnakeHit();
      checkFoodHit()
    }
    function moveDown() {
      removeTail();
      newHeadY = snake[0].y + snakeSize;
      newHeadX = snake[0].x;
      drawNewHead(newHeadX, newHeadY);
      checkBoundary();
      checkSnakeHit();
      checkFoodHit()
    }
    function moveRight() {
      newHeadY = snake[0].y;
      newHeadX = snake[0].x + snakeSize;
      removeTail();
      drawNewHead(newHeadX, newHeadY);
      checkBoundary();
      checkSnakeHit();
      checkFoodHit()
    }
    function increaseSpeed() {
      if (gameSpeed > 300) gameSpeed -= 50;
      else if (gameSpeed > 100) gameSpeed -= 25;
      else if (gameSpeed > 1) gameSpeed -= 5;
      else if (gameSpeed === 1) gameSpeed = 1;
      console.log(gameSpeed);
      stopInterval();
      switch(direction) {
        case 'up':
          intervalId = setInterval(moveUp, gameSpeed);
          break;
        case 'down':
          intervalId = setInterval(moveDown, gameSpeed);
          break;
        case 'left':
          intervalId = setInterval(moveLeft, gameSpeed);
          break;
        case 'right':
          intervalId = setInterval(moveRight, gameSpeed);
          break;
      }
    }
    function generateRandomXY() {
      foodX = Math.round((Math.random() * 480) / 20) * 20;
      foodY = Math.round((Math.random() * 480) / 20) * 20;
      for (let i = 0; i < snake.length; i++) {
        if (foodX === snake[i].x && foodY === snake[i].y)
          generateRandomXY();
      }
    }

  game();
  // document.addEventListener("keydown", keyPush);
};
