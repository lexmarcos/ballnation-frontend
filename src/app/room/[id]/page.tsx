"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import React, { useEffect, useRef, useState } from "react";
import { IGameState, IPlayer, IRoomGame } from "./types";
import styles from "./styles.module.css";
import WaitingPlayers from "./waitingPlayers";
import GamePage from "./game";

function RoomGame({ params }: { params: { id: string } }) {
  const socket = useSocket();
  const { username } = useAuth();
  const [isSeletedTeam, setIsSeletedTeam] = useState(false);
  const [room, setRoom] = useState<IRoomGame>({} as IRoomGame);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
        console.log(room);
      });

      socket.on("gameState", (gameState: IGameState) => {
        console.log(gameState);
      });

      socket.on("error", (error: any) => {
        console.error(room);
      });
    }
  }, [socket]);

  const handleMovePlayer = (key: string) => {
    switch (key) {
      case "w":
        console.log("movendo W");
        break;
      case "a":
        console.log("movendo A");
        break;
      case "s":
        console.log("movendo S");
        break;
      case "d":
        console.log("movendo D");
        break;
      default:
        break;
    }
  };

  const renderGame = () => {
    console.log("render game");
    return (
      <div
        className={styles.gameContent}
        autoFocus
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d")
            handleMovePlayer(e.key);
        }}
      >
        <canvas className={styles.gameCanva} ref={canvasRef} width={1280} height={720} />
      </div>
    );
  };

  const drawGame = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        // Draw field
        context.fillStyle = "#008000";
        context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw goals
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, canvasRef.current.height / 2 - 150, 10, 300); // Left goal
        context.fillRect(canvasRef.current.width - 10, canvasRef.current.height / 2 - 150, 10, 300); // Right goal

        // Draw ball
        context.beginPath();
        context.arc(
          canvasRef.current.width / 2,
          canvasRef.current.height / 2,
          10,
          0,
          2 * Math.PI,
          false
        );
        context.fillStyle = "#FFFFFF";
        context.fill();

        // Draw players
        context.beginPath();
        context.arc(100, canvasRef.current.height / 2, 20, 0, 2 * Math.PI, false);
        context.fillStyle = "#0000FF";
        context.fill(); // Blue player

        context.beginPath();
        context.arc(
          canvasRef.current.width - 110,
          canvasRef.current.height / 2,
          20,
          0,
          2 * Math.PI,
          false
        );
        context.fillStyle = "#FF0000";
        context.fill(); // Red player
      }
    }
  };

  useEffect(() => {
    drawGame();
  }, []);
  console.log(room.gameStatus)
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
      {room.gameStatus !== "waiting players" && <GamePage />}
    </>
  );
}

export default RoomGame;
