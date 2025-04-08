var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var grid = 10;
var count = 0;
let score = 0;
let isFirstRun = true;

const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('bestScore');
const modul = document.querySelector('.modal');
const medul = document.querySelector('.medal');
const modulKapat = document.getElementById('again');
const playButton = document.getElementById('playButton');
const popupScore = document.getElementById('popupScore');
const popupBestScore = document.getElementById('popupBestScore');
const showColor = document.getElementById('colorModal');
const snakeColorPicker = document.getElementById('snakeColorPicker');
const appleColorPicker = document.getElementById('appleColorPicker');

var bestScore = localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : 0;
var snakeColor = '#FFFFFF';
var appleColor = '#2C2966';

var snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};

function getSafeApplePosition() {
  let safePositions = [];
  for (let i = 0; i < canvas.width / grid; i++) {
    for (let j = 0; j < canvas.height / grid; j++) {
      safePositions.push({ x: i * grid, y: j * grid });
    }
  }

  snake.cells.forEach(cell => {
    safePositions = safePositions.filter(pos => !(pos.x === cell.x && pos.y === cell.y));
  });

  return safePositions[Math.floor(Math.random() * safePositions.length)];
}

var yem = getSafeApplePosition();
var gameRunning = false;

function endGame() {
  modul.style.display = "flex";
  popupScore.textContent = `Skor: ${score}`;
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('bestScore', bestScore);
  }
  popupBestScore.textContent = `Rekor: ${bestScore}`;
  gameRunning = false;
}

function showColorPicker(){
    modul.style.display = 'none';
    medul.style.display = 'flex';
}

function startGame() {
  if (isFirstRun) {
    showColor.style.display = "none";
    playButton.style.display = 'none';
    isFirstRun = false;
  }
  modul.style.display = "none";
  score = 0;
  snake.x = 160;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = grid;
  snake.dy = 0;
  gameRunning = true;
  loop();
}

function loop() {
  if (!gameRunning) return;
  requestAnimationFrame(loop);
  if (++count < 4) return;
  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);
  snake.x += snake.dx;
  snake.y += snake.dy;

  if(snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
    endGame();
    return;
  }

  snake.cells.unshift({x: snake.x, y: snake.y});
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  context.fillStyle = snakeColor; // Yılanın rengi
  snake.cells.forEach(cell => {
    context.fillRect(cell.x, cell.y, grid, grid);
  });

  context.fillStyle = appleColor; // Elmanın rengi
  context.fillRect(yem.x, yem.y, grid, grid);

  if (snake.x === yem.x && snake.y === yem.y) {
    score++;
    snake.maxCells++;
    yem = getSafeApplePosition();
  }

  for (let i = 1; i < snake.cells.length; i++) {
    if (snake.x === snake.cells[i].x && snake.y === snake.cells[i].y) {
      endGame();
      return;
    }
  }

  scoreElement.textContent = `Skor: ${score}`;
  bestScoreElement.textContent = `Rekor: ${bestScore}`;
}

document.addEventListener('keydown', function(e) {
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

function applyColors() {
  var newSnakeColor = snakeColorPicker.value;
  var newAppleColor = appleColorPicker.value;

  if (newSnakeColor === newAppleColor) {
      alert("Yılan ve elma için aynı renk seçilemez!");
      return;
  }

  snakeColor = newSnakeColor;
  appleColor = newAppleColor;
}

function closeColorPicker() {
  showColor.style.display = "none";
  endGame();
}

playButton.addEventListener('click', startGame);
modulKapat.addEventListener('click', startGame);
