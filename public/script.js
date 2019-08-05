const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const scoreHTML = document.getElementById("score");
const highScoreHTML = document.getElementById("highScore");
const playerNameHTML = document.getElementById("playerName-holder");
document.getElementById("btnReset").addEventListener("click", resetGame);

let boxSize = 30;
let score = 0;
let highScore = 0;
let playerName = "";

let appleImage = new Image();
appleImage.src = "apple.png";
let apple = setApple();

let snake;
let direction;
let gameRefreshInterval;

getHighScore();
function getHighScore() {
  fetch("/get-highscore")
    .then(res => res.json())
    .then(data => {
      highScore = data;
      fetch("/get-playerName")
        .then(res => res.text())
        .then(data => {
          playerName = data;
          setUpGame();
        });
    });
}

function setApple() {
  return {
    x: Math.floor(Math.random() * 20) * boxSize,
    y: Math.floor(Math.random() * 20) * boxSize
  };
}

function setUpGame() {
  document.querySelector(".score").style.display = "none";
  highScoreHTML.innerHTML = highScore;
  playerNameHTML.innerHTML = `(${playerName})`;
  score = 0;
  scoreHTML.innerHTML = score;

  snake = [];
  snake[0] = { x: 10 * boxSize, y: 10 * boxSize };
  direction = "";
  gameRefreshInterval = setInterval(playGame, 100);
}

document.addEventListener("keydown", setDirection);
function setDirection(event) {
  let pressedKey = event.code;

  if (pressedKey == "ArrowLeft" && direction != "RIGHT") direction = "LEFT";
  if (pressedKey == "ArrowRight" && direction != "LEFT") direction = "RIGHT";
  if (pressedKey == "ArrowUp" && direction != "DOWN") direction = "UP";
  if (pressedKey == "ArrowDown" && direction != "UP") direction = "DOWN";
}

function playGame() {
  context.fillStyle = "#FFF";
  context.fillRect(0, 0, 600, 600);
  context.strokeStyle = "#FF1D19";
  context.lineWidth = 5;
  context.strokeRect(0, 0, 600, 600);

  for (let i = 0; i < snake.length; i++) {
    context.fillStyle = i == 0 ? "#14A647" : "#FF1D19";
    context.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);

    context.strokeStyle = "#000";
    context.lineWidth = 2;
    context.strokeRect(snake[i].x, snake[i].y, boxSize, boxSize);
  }
  context.drawImage(appleImage, apple.x, apple.y);

  let snakeHead = {
    x: snake[0].x,
    y: snake[0].y
  };

  switch (direction) {
    case "LEFT":
      snakeHead.x -= boxSize;
      break;
    case "RIGHT":
      snakeHead.x += boxSize;
      break;
    case "UP":
      snakeHead.y -= boxSize;
      break;
    case "DOWN":
      snakeHead.y += boxSize;
      break;
  }

  if (snakeHead.x == apple.x && snakeHead.y == apple.y) {
    score++;
    scoreHTML.innerHTML = score;
    apple = setApple();
  } else snake.pop();

  let unshiftedHead = {
    x: snakeHead.x,
    y: snakeHead.y
  };
  snake.unshift(unshiftedHead);

  if (collisionCheck(unshiftedHead, snake)) {
    clearInterval(gameRefreshInterval);
    handleScoring();
  }
}

function collisionCheck(head, snake) {
  if (
    head.x < 0 ||
    head.x === 20 * boxSize ||
    head.y < 0 ||
    head.y === 20 * boxSize
  )
    return true;
  for (let i = 1; i < snake.length; i++) {
    if (head.x == snake[i].x && head.y == snake[i].y) return true;
  }
  return false;
}

function resetGame() {
  clearInterval(gameRefreshInterval);
  getHighScore();
}

function handleScoring() {
  let btnSubmit = document.getElementById("submit");
  document.querySelector(".score").style.display = "block";
  document.getElementById("scoreEnter").innerHTML =
    score <= highScore
      ? `GAME OVER!<br>Your score: ${score}`
      : `New highscore!: ${score}`;
  score <= highScore
    ? ((document.getElementById("playerName").style.display = "none"),
      (btnSubmit.style.display = "none"))
    : ((document.getElementById("playerName").style.display = "inline"),
      (btnSubmit.style.display = "inline"));
  btnSubmit.addEventListener("click", submitScore);
}

function submitScore() {
  document.getElementById("submit").removeEventListener("click", submitScore);
  let name = document.getElementById("playerName").value;
  console.log(score, name);
  if (score > highScore) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `/add-highscore?points=${score}&name=${name}`);
    xhr.send();
  }
}
