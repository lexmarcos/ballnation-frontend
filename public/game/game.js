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
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(x, y, raio, 0, 2 * Math.PI);
  ctx.fill();
  const borderColor = cor; // cor da borda
  const borderWidth = 5; // largura da borda
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;
  ctx.stroke();
}

let gameState = {};

socket.on("gameState", (_gameState) => {
  gameState = _gameState;
});

const translateTeams = {
  blue: "Azul",
  red: "Vermelho",
};

const playLoadingAnimation = () => {
  const progressBar = document.getElementById("progress-bar");

  let width = 100; // A width inicial da barra de progresso
  let interval = setInterval(() => {
    width -= 1; // Decrementa a largura a cada segundo
    progressBar.style.width = width + "%";
    if (width <= 0) {
      clearInterval(interval); // Parar o intervalo quando a largura chega a zero
    }
  }, 90);
};

socket.on("gameFinished", (wonTeam) => {
  const wonPage = getElement("winner-page");
  wonPage.style.display = "flex";
  const teamWonElement = getElement("card-winner");
  teamWonElement.innerHTML = `
    <lottie-player
      src="https://assets7.lottiefiles.com/packages/lf20_touohxv0.json"
      background="transparent"
      speed="1"
      style="width: 400px; height: 400px"
      autoplay
    ></lottie-player>
    <h1>Vitória do time<br /><span id="winner-team">${translateTeams[wonTeam]}</span></h1>
    <div id="progress-bar-container">
      <div id="progress-bar"></div>
    </div>
    `;
  playLoadingAnimation();
});

socket.on("awaitingPlayersAgain", () => {
  const awaitingPage = getElement("awaiting-page");
  awaitingPage.style.display = "flex";
  const gamePage = getElement("game-page");
  gamePage.style.display = "none";
  const wonPage = getElement("winner-page");
  wonPage.style.display = "none";
});

function drawPlayers() {
  for (const key in gameState.playersData) {
    const player = gameState.playersData[key];
    drawCircle(player.team, player.position.x, player.position.y, 30);
  }
}

function drawPaddles() {
  for (const keyPaddle in gameState.paddlesData) {
    const paddle = gameState.paddlesData[keyPaddle];
    if (!paddle.isTaken) {
      drawCircle("#ffa600", paddle.x, paddle.y, 10);
    }
  }
}

const keyMap = {};

document.addEventListener("keyup", ({ key }) => (keyMap[key] = false));
document.addEventListener("keydown", ({ key }) => (keyMap[key] = true));

function isPressed(keyCode) {
  return keyMap[keyCode] || false;
}

function isComboPressed(keys) {
  return keys.every(isPressed);
}

const handleMoves = () => {
  if (isComboPressed(["Shift", "w"])) {
    console.log("boostando");
    socket?.emit("move", { move: "boostUp", username, room });
  }
  if (isComboPressed(["Shift", "s"])) {
    console.log("boostando");
    socket?.emit("move", { move: "boostDown", username, room });
  }
  if (isComboPressed(["Shift", "a"])) {
    console.log("boostando");
    socket?.emit("move", { move: "boostLeft", username, room });
  }
  if (isComboPressed(["Shift", "d"])) {
    console.log("boostando");
    socket?.emit("move", { move: "boostRight", username, room });
  }
  if (!isPressed("Shift")) {
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
    drawCircle("#000000", gameState.ballPosition.x, gameState.ballPosition.y, 10);
    drawPlayers();
    ctx.globalCompositeOperation = "destination-over";
    drawPaddles();
  }
}

render();
