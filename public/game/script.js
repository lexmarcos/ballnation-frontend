const room = window.location.pathname.split("/")[2];
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

const socket = io("http://localhost:9000", {
  query: {
    token,
  },
});

socket.emit("joinRoom", { room, username });

const initSocketListeners = () => {
  socket.on("joinedRoom", (roomData) => {
    onJoinedRoomOrTeam(roomData);
  });

  socket.on("joinedToTeam", (roomData) => {
    onJoinedRoomOrTeam(roomData);
  });
};

const generatePlayerElement = (player) => {
  const playerElement = document.createElement("h4");
  playerElement.innerText = player.username;
  return playerElement;
};

const onJoinedRoomOrTeam = (roomData) => {
  console.log(roomData);
  const bluePlayersElement = getElement("blue-players");
  const redPlayersElement = getElement("red-players");
  for (const player of roomData.teams.blue.players) {
    console.log(player);
    bluePlayersElement.appendChild(generatePlayerElement(player));
  }
  for (const player of roomData.teams.red.players) {
    bluePlayersElement.appendChild(generatePlayerElement(player));
  }
};

const joinOnTeam = (team) => {
  console.log(team);
  socket.emit("joinTeam", { room, team, username });
};

const initGamePage = () => {
  const awaitingPage = getElement("awaiting-page");
  awaitingPage.style.display = "none";
};
