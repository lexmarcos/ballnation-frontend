const room = window.location.pathname.split("/")[2];
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

const socket = io("http://localhost:9000", {
  query: {
    token,
  },
});

const bluePlayers = [];
const redPlayers = [];

socket.emit("joinRoom", { room, username });

const handleKeyDown = (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
};

const appendMessage = (message, author) => {
  const messagesElement = getElement("chat-messages");
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `
  <span class="message-author" style="color: ${stringToColor(author)}">
    ${author}
  </span>: <span>${message}</span>`;
  messagesElement.appendChild(messageElement);
};

const initSocketListeners = () => {
  socket.on("joinedRoom", (roomData) => {
    if (roomData.gameStatus === "playing") {
      initGamePage();
    }
    onJoinedRoomOrTeam(roomData);
  });

  socket.on("joinedToTeam", (roomData) => {
    onJoinedRoomOrTeam(roomData);
  });

  socket.on("gameStarted", () => {
    initGamePage();
  });

  socket.on("newMessage", ({ text, author }) => {
    appendMessage(text, author);
  });
};

initSocketListeners();

const sendMessage = () => {
  const inputElement = getElement("chat-input");
  const message = inputElement.value;
  inputElement.value = "";
  socket.emit("message", { room, text: message, author: username });
};

const generatePlayerElement = (player) => {
  const playerElement = document.createElement("h4");
  playerElement.innerText = player.username;
  return playerElement;
};

const disableJoinButtonsIfHasLocalPlayer = (player) => {
  const blueJoinButton = getElement("blue-team-button");
  const redJoinButton = getElement("red-team-button");
  if (player === username) {
    blueJoinButton.disabled = true;
    redJoinButton.disabled = true;
  }
};

function startGame() {
  socket.emit("startGame", { room, username });
}

const onJoinedRoomOrTeam = (roomData) => {
  const ownerUsernameElement = getElement("owner-username");
  ownerUsernameElement.innerText = roomData.owner;
  if (roomData.owner === username) {
    getElement("startPlayButton").style.display = "block";
  }
  const bluePlayersElement = getElement("blue-players");
  const redPlayersElement = getElement("red-players");

  if (roomData.teams.blue.players.length === roomData.numberOfPlayers / 2) {
    getElement("blue-team-button").disabled = true;
  }
  if (roomData.teams.red.players.length === roomData.numberOfPlayers / 2) {
    getElement("red-team-button").disabled = true;
  }

  for (const player of roomData.teams.blue.players) {
    disableJoinButtonsIfHasLocalPlayer(player.username);
    if (bluePlayers.includes(player.username)) continue;

    bluePlayers.push(player.username);
    bluePlayersElement.appendChild(generatePlayerElement(player));
  }
  for (const player of roomData.teams.red.players) {
    disableJoinButtonsIfHasLocalPlayer(player.username);
    if (redPlayers.includes(player.username)) continue;

    redPlayers.push(player.username);
    redPlayersElement.appendChild(generatePlayerElement(player));
  }
};

const joinOnTeam = (team) => {
  socket.emit("joinTeam", { room, team, username });
};

const initGamePage = () => {
  const awaitingPage = getElement("awaiting-page");
  const gamePage = getElement("game-page");
  awaitingPage.style.display = "none";
  gamePage.style.display = "flex";
};
