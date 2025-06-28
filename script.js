// 🎮 Elementos del DOM
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const gameOverScreen = document.getElementById("game-over-screen");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const scoreDisplay = document.getElementById("score");
const finalScore = document.getElementById("final-score");

// 🐍 Juego Snake
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20; // Tamaño de cada celda

let snake, direction, food, score, game, speed;
let highScore = localStorage.getItem("snakeHighScore") || 0;

// 🎯 Mostrar récord al cargar
scoreDisplay.innerHTML = `Puntaje: 0 | 🏆 Mejor: ${highScore}`;

// ▶️ Comenzar juego
startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameContainer.style.display = "block";
  startGame();
});

// 🔁 Reiniciar juego
restartButton.addEventListener("click", () => {
  gameOverScreen.style.display = "none";
  gameContainer.style.display = "block";
  startGame();
});

// ⌨️ Movimiento con flechas
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// 🚀 Iniciar nuevo juego
function startGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT";
  score = 0;
  speed = 120;
  updateScore();
  placeFood();
  clearInterval(game);
  game = setInterval(draw, speed);
}

// 🍎 Generar comida aleatoria
function placeFood() {
  food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
  };
}

// 💾 Actualizar puntaje y récord
function updateScore() {
  highScore = Math.max(score, highScore);
  localStorage.setItem("snakeHighScore", highScore);
  scoreDisplay.innerHTML = `Puntaje: ${score} | 🏆 Mejor: ${highScore}`;
}

// 🖼️ Dibujar juego
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar serpiente
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#4caf50" : "#8bc34a";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Dibujar comida
  ctx.fillStyle = "#ff5722";
  ctx.fillRect(food.x, food.y, box, box);

  // Movimiento
  let headX = snake[0].x;
  let headY = snake[0].y;
  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;

  // Colisión con pared o cuerpo
  if (
    headX < 0 || headX >= canvas.width ||
    headY < 0 || headY >= canvas.height ||
    collision({ x: headX, y: headY }, snake)
  ) {
    gameOver();
    return;
  }

  // Comer comida
  if (headX === food.x && headY === food.y) {
    score++;
    updateScore();
    placeFood();

    // Aumentar velocidad cada 5 puntos
    if (score % 5 === 0 && speed > 50) {
      clearInterval(game);
      speed -= 10;
      game = setInterval(draw, speed);
    }
  } else {
    snake.pop();
  }

  snake.unshift({ x: headX, y: headY });
}

// 💥 Game Over
function gameOver() {
  clearInterval(game);
  gameContainer.style.display = "none";
  gameOverScreen.style.display = "flex";
  finalScore.innerText = `Tu puntaje fue: ${score}`;
}

// 🧠 Verificar colisión con el cuerpo
function collision(head, body) {
  return body.some(part => part.x === head.x && part.y === head.y);
}

// Controles táctiles
const controls = document.querySelectorAll(".control");

controls.forEach(button => {
  button.addEventListener("click", () => {
    const dir = button.dataset.dir;
    if (
      (dir === "LEFT" && direction !== "RIGHT") ||
      (dir === "UP" && direction !== "DOWN") ||
      (dir === "RIGHT" && direction !== "LEFT") ||
      (dir === "DOWN" && direction !== "UP")
    ) {
      direction = dir;
    }
  });
});