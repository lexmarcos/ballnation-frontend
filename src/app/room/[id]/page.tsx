"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import React, { useEffect, useRef, useState } from "react";
import { IPlayer, IRoomGame } from "./types";

function RoomGame({ params }: { params: { id: string } }) {
  const socket = useSocket();
  const { username } = useAuth();
  const [room, setRoom] = useState<IRoomGame>({} as IRoomGame);
  const [isSeletedTeam, setIsSeletedTeam] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (socket && username) {
      socket.emit("joinRoom", { room: params.id, username });
      socket.on("joinedRoom", (room: any) => {
        if (
          room.teams.blue.players?.find(
            (player: IPlayer) => player.username === username
          ) ||
          room.teams.red.players?.find(
            (player: IPlayer) => player.username === username
          )
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

      socket.on("error", (error: any) => {
        console.error(room);
      });
    }
  }, [socket]);

  const joinInTeam = (team: "blue" | "red") => {
    setIsSeletedTeam(true);
    if (socket && username) {
      console.log("aqui");
      socket.emit("joinTeam", { room: params.id, username, team });

      socket.on("joinedRoom", (room: any) => {
        console.log(room);
        setRoom(room);
      });
    }
  };

  const waitingPlayers = () => {
    <div className="flex flex-col items-center justify-center h-screen">
      {room.teams && (
        <>
          <h1 className="text-4xl mb-10">Esperando os jogadores</h1>
          <div className="flex w-full justify-around">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl mb-5 text-blue-500">Time Azul</h2>
              <button
                disabled={isSeletedTeam}
                onClick={() => joinInTeam("blue")}
                className="bg-blue-500 uppercase tracking-widest text-white font-bold text-sm rounded-md p-2 mt-3 w-full disabled:bg-slate-500"
              >
                Entrar no time azul
              </button>
              {room.teams.blue.players?.map((player) => (
                <p key={player.socketId} className="mb-2">
                  {player.username}
                </p>
              ))}
            </div>
            <div className="flex flex-col items-center">
              <h2 className="text-2xl mb-5 text-red-500">Time Vermelho</h2>
              <button
                disabled={isSeletedTeam}
                onClick={() => joinInTeam("red")}
                className="bg-red-500 uppercase tracking-widest text-white font-bold text-sm rounded-md p-2 mt-3 w-full disabled:bg-slate-600"
              >
                Entrar no time vermelho
              </button>
              {room.teams.red.players?.map((player) => (
                <p key={player.socketId} className="mb-2">
                  {player.username}
                </p>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  };

  const renderGame = () => {
    console.log("render game")
    return (
      <div>
      <canvas ref={canvasRef} width={500} height={500} />
    </div>
    );
  };

  const drawPlayer = (x: number, y: number) => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.clearRect(0, 0, 500, 500); // Clear previous player position
        context.fillStyle = '#000';
        context.fillRect(x, y, 50, 50); // Draw new player position
      }
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.fillStyle = '#00ff00';
        context.fillRect(0, 0, 500, 500);
        drawPlayer(0, 0); // Initial player position
      }
    }
  }, []);

  const handleMove = (key: string) => {
    switch (key) {
      case 'w':
        console.log("movendo W")
        break;
      case 'a':
        console.log("movendo A")
        break;
      case 's':
        console.log("movendo S")
        break;
      case 'd':
        console.log("movendo D")
        break;
      default:
        break;
    }
    // drawPlayer(playerPosition.current.x, playerPosition.current.y);
  };

  return (
    <>
    {room.gameStatus === "waiting players" && waitingPlayers()}
    {room.gameStatus === "playing" && renderGame()}
    </>
  );
}

export default RoomGame;
