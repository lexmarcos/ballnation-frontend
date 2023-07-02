import { IRoomGame } from "@/app/room/[id]/types";

export interface IFormOfRoom {
    room: string;
    numberOfPlayers: 2 | 4 | 6 | 8;
    typeOfGame: "classic" | "withPowerUps";
    duration: number;
    players: string[];
    closed: string;
    id: string;
  }
  
  export interface IRoomObjects {
    [key: string]: IRoomGame;
  }
  