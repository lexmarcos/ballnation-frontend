"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import React, { useEffect, useRef, useState } from "react";
import { IGameState, IPlayer, IRoomGame } from "./types";
import styles from "./styles.module.css";
import WaitingPlayers from "./waitingPlayers";

function RoomGame({ params }: { params: { id: string } }) {
  const socket = useSocket();
  const { username } = useAuth();
  const [isSeletedTeam, setIsSeletedTeam] = useState(false);
  const [room, setRoom] = useState<IRoomGame>({} as IRoomGame);

  useEffect(() => {
    if (socket && username) {
      socket.emit("joinRoom", { room: params.id, username });
      socket.on("joinedRoom", (room: any) => {
        if (
          room.teams.blue.players?.find((player: IPlayer) => player.username === username) ||
          room.teams.red.players?.find((player: IPlayer) => player.username === username)
        ) {
          setIsSeletedTeam(true);
        }
        setRoom(room);
      });

      socket.on("joinedToTeam", (room: any) => {
        setRoom(room);
      });

      socket.on("startGame", (room: any) => {
        setRoom(room);
      });

      socket.on("error", (error: any) => {
        console.error(room);
      });
    }
  }, [socket]);

  return (
    <>
      {room.gameStatus === "waiting players" && (
        <WaitingPlayers
          room={room}
          setRoom={setRoom}
          params={params}
          isSeletedTeam={isSeletedTeam}
          setIsSeletedTeam={setIsSeletedTeam}
        />
      )}
    </>
  );
}

export default RoomGame;
