"use client";
import { IRoom } from "@/components/Rooms";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function RoomGame({ params }: { params: { id: string } }) {
  const socket = useSocket();
  const { username } = useAuth();
  const [room, setRoom] = useState<IRoom>({} as IRoom);
  const router = useRouter();

  useEffect(() => {
    if (socket && username) {
      console.log("aqui");
      socket.emit("joinRoom", {  room: [params.id], username });

      socket.on("joinedRoom", (room: any) => {
        console.log(room);
        setRoom(room);
      });
    }
  }, [socket]);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl mb-10">Esperando os jogadores</h1>
      <div className="flex w-full justify-around">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl mb-5 text-blue-500">Time Azul</h2>
          {room.players?.map((player) => (
            <p key={player} className="mb-2">
              {player}
            </p>
          ))}
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl mb-5 text-red-500">Time Vermelho</h2>
          {room.players?.map((player) => (
            <p key={player} className="mb-2">
              {player}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoomGame;
