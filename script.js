const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20; // Tamaño de cada cuadrado
let score = 0;

let snake = [{ x: 9 * box, y: 10 * box }];
let direction = "RIGHT";

// Generar comida en una posición aleatoria
let food = {
  x: Math.floor(Math.random() * 19 + 1) * box,
  y: Math.floor(Math.random() * 19 + 1) * box,
};

document.addEventListener("keydown", changeDirection);

function changeDirection(e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar la serpiente
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#4caf50" : "#8bc34a";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Dibujar la comida
  ctx.fillStyle = "#ff5722";
  ctx.fillRect(food.x, food.y, box, box);

  // Mover la serpiente
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;

  // Verificar colisión con comida
  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById("score").innerText = `Puntaje: ${score}`;
    food = {
      x: Math.floor(Math.random() * 19 + 1) * box,
      y: Math.floor(Math.random() * 19 + 1) * box,
    };
  } else {
    snake.pop(); // Eliminar la cola si no comió
  }

  // Nueva cabeza
  const newHead = { x: headX, y: headY };

  // Verificar colisión con bordes o con uno mismo
  if (
    headX < 0 ||
    headX >= canvas.width ||
    headY < 0 ||
    headY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert("¡Game Over! Tu puntaje: " + score);
  }

  snake.unshift(newHead);
}

// Verifica si la nueva cabeza choca con alguna parte del cuerpo
function collision(head, body) {
  for (let i = 0; i < body.length; i++) {
    if (head.x === body[i].x && head.y === body[i].y) {
      return true;
    }
  }
  return false;
}

// Iniciar el juego
let game = setInterval(draw, 100);