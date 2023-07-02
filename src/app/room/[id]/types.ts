export interface IPlayerStats {
  goals: number;
  // Adicione mais estatísticas aqui conforme necessário
}

export interface IPlayer {
  socketId: string;
  username: string;
  stats: IPlayerStats;
}

export enum GameStatus {
  WaitingPlayers = "waiting players",
  Playing = "playing",
  FinishedGame = "finished game",
}

export interface ITeam {
  players: IPlayer[];
  // Adicione mais propriedades aqui se a equipe tiver suas próprias características
}

export interface IRoomGame {
  room: string;
  numberOfPlayers: 2 | 4 | 6 | 8;
  typeOfGame: "classic" | "withPowerUps";
  duration: number;
  teams: {
    blue: ITeam;
    red: ITeam;
  };
  gameStatus: GameStatus;
  id: string;
  isClosed: boolean;
}
