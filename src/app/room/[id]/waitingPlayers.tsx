"use client";
import React, { useState } from "react";
import { IRoomGame } from "./types";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";

interface IProps {
  room: IRoomGame;
  setRoom: React.Dispatch<React.SetStateAction<IRoomGame>>;
  params: { id: string };
  setIsSeletedTeam: React.Dispatch<React.SetStateAction<boolean>>;
  isSeletedTeam: boolean;
}

function WaitingPlayers({ room, setRoom, params, setIsSeletedTeam, isSeletedTeam }: IProps) {
  const socket = useSocket();
  const { username } = useAuth();

  const joinInTeam = (team: "blue" | "red") => {
    setIsSeletedTeam(true);
    if (socket && username) {
      socket.emit("joinTeam", { room: params.id, username, team });

      socket.on("joinedRoom", (room: any) => {
        console.log(room);
        setRoom(room);
      });
    }
  };

  return (
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
  );
}

export default WaitingPlayers;