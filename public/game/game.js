const canvas = document.getElementById("canvas-game");
const ctx = canvas.getContext("2d");

const worldBounds = {
  min: { x: 0, y: 0 },
  max: { x: 1280, y: 720 },
};

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawRect(cor, x, y, largura, altura) {
  ctx.fillStyle = cor;
  ctx.fillRect(x, y, largura, altura);
}

function drawCircle(cor, x, y, raio) {
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.arc(x, y, raio, 0, 2 * Math.PI);
  ctx.fill();
}

let gameState = {};

socket.on("gameState", (_gameState) => {
  console.log(_gameState);
  gameState = _gameState;
});

function drawPlayers() {
  for (const player of Object.values(gameState.playersPositions)) {
    drawCircle("#FFFFFF", player.x, player.y, 30);
  }
}

const keyMap = {};

document.addEventListener("keyup", ({ key }) => (keyMap[key] = false));
document.addEventListener("keypress", ({ key }) => (keyMap[key] = true));

function isPressed(keyCode) {
  return keyMap[keyCode] || false;
}

const handleMoves = () => {
  if (isPressed("w")) {
    socket?.emit("move", { move: "up", username, room });
  }
  if (isPressed("s")) {
    socket?.emit("move", { move: "down", username, room });
  }
  if (isPressed("a")) {
    socket?.emit("move", { move: "left", username, room });
  }
  if (isPressed("d")) {
    socket?.emit("move", { move: "right", username, room });
  }
  if (isPressed(" ")) {
    socket?.emit("move", { move: "shoot", username, room });
  }
};

const setScore = (score) => {
  const blueScore = getElement("blue-score");
  blueScore.innerText = score.blue;
  const redScore = getElement("red-score");
  redScore.innerText = score.red;
};

function render() {
  clearCanvas();
  requestAnimationFrame(render);
  if (Object.values(gameState).length > 0) {
    handleMoves();
    setScore(gameState.score);
    drawRect("#FFFFFF", 0, worldBounds.max.y / 2 - 150, 10, 300);
    drawRect("#FFFFFF", 1270, worldBounds.max.y / 2 - 150, 10, 300);
    drawCircle("#FFFFFF", gameState.ballPosition.x, gameState.ballPosition.y, 10);
    drawPlayers();
  }
}

render();
