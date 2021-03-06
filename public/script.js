window.onload = function() {
  let myCanvas = document.getElementById("canvas");
  let ctx = myCanvas.getContext("2d");
  let snake = [];
  const initSnakeLength = 8;
  const snakeSize = 20;
  const boundaryX = 500;
  const boundaryY = 500;
  let foodX = 0;
  let foodY = 0;
  let goinUp = true;
  let goinLeft = false;
  let newHeadY = '';
  let newHeadX = '';
  let gameSpeed = 350;
  let gameOver = false;
  let foodDrawn = false;
  let scoreNumber = 0;
  let highScoreNumber = 0;

  startScreen();

//Start Screen functions
  function startScreen() {
    let timeoutID = setTimeout(function() {
      hideStartScreen();
      game();
    }, 60000);
    loadScore();
    document.body.querySelector("#playButton").addEventListener("click", function() {
      restartGame(timeoutID);
    });
  }
  function restartGame(timeout) {
    hideStartScreen();
    clearTimeout(timeout);
    game();
  }
  function hideStartScreen() {
    document.body.querySelector("#startContainer").style.display = "none";
  }

//game function
  function game() {
      loadScore();
      generateRandomXY();
      drawFood(foodX, foodY, snakeSize, snakeSize);
      buildInitSnake();
      intervalId = setInterval(moveUp, gameSpeed);
      direction = 'up';
      chooseDirection();
  }

//snake controls
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

//check boundaries
  function checkBoundary() {
    if (snake[0].y > 480 || snake[0].y < 0 || snake[0].x > 480 || snake[0].x < 0) {
      clearInterval(intervalId);
      gameOver = true;
      updateHighScore();
      restartScreen();
    }
  }
  function checkSnakeHit() {
    for (let i = 1; i < snake.length; i++) {
      if ((snake[0].y === snake[i].y) && (snake[0].x === snake[i].x)) {
        clearInterval(intervalId);
        gameOver = true;
        updateHighScore();
        restartScreen();
      }
    }
  }
  function checkFoodHit() {
    if ((snake[0].y === foodY) && (snake[0].x === foodX)) {
      drawNewHead(newHeadX, newHeadY);
      foodDrawn = false;
      generateRandomXY();
      drawFood(foodX, foodY, snakeSize, snakeSize);
      updateScore();
      increaseSpeed();
    }
  }

//Score functions
  function loadScore() {
    let score = document.body.querySelector("#score");
    let highScore = document.body.querySelector("#highScore");
    score.innerHTML = scoreNumber;
    axios.get('/api/').then(response => {
      highScoreNumber = response.data;
      this.highScore.innerHTML = response.data;
      return true;
    }).catch(err => {
    });
  }
  function updateScore() {
    if (gameSpeed <= 300) scoreNumber += 50;
    else if (gameSpeed <= 200) scoreNumber += 75;
    else if (gameSpeed <= 100) scoreNumber += 100;
    else scoreNumber += 25;
    console.log(gameSpeed);
    score.innerHTML = scoreNumber;
  }
  function updateHighScore() {
    if (scoreNumber > highScoreNumber) {
      document.body.querySelector("#highScoreText").style.display = "block";
      axios.put('/api/', {
        highScore: scoreNumber,
      }).then(response => {
        highScoreNumber = response.data;
        return true;
      }).catch(err => {
      });
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
      let startx = 240;
      let starty = 200;
      for (let i = 0; i < initSnakeLength; i++) {
        drawSnakeComponent(startx, starty, snakeSize);
        let snakeComp = {x: startx, y: starty};
        snake.push(snakeComp);
        starty += snakeSize;
      }
    }
    function drawFood(x,y,size) {
      if (!foodDrawn) {
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, size, size);
        ctx.stroke();
        foodDrawn = true;
      }
    }
    function removeHead() {
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
      else if (gameSpeed > 50) gameSpeed -= 5;
      else if (gameSpeed > 1) gameSpeed -= 1;
      else if (gameSpeed === 1) gameSpeed = 1;
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

    function unHideButton() {
      restartContainer.style.display = "block";
    }
    function hideButton() {
      restartContainer.style.display = "none";
    }
    function restartScreen() {
      unHideButton();
      document.body.querySelector("#restartScore").innerHTML = scoreNumber;
      document.body.querySelector("#restartButton").addEventListener("click", hideRestartScreen);
    }
    function resetVariables() {
      snake = [];
      startx = 240;
      starty = 200;
      foodX = 0;
      foodY = 0;
      direction = '';
      intervalId = '';
      goinUp = true;
      goinLeft = false;
      newHeadY = '';
      newHeadX = '';
      gameSpeed = 350;
      gameOver = false;
      foodDrawn = false;
      scoreNumber = 0;
      highScoreNumber = 0;
      document.body.querySelector("button").removeEventListener("click", hideRestartScreen);
    }
    function hideRestartScreen() {
      hideButton();
      document.body.querySelector("#highScoreText").style.display = "none";
      ctx.clearRect(0,0,myCanvas.width, myCanvas.height);
      resetVariables();
      game();
    }
  // document.addEventListener("keydown", keyPush);
};
