"use client";
import classNames from "classnames";
import styles from "./styles.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import Input from "@/components/Input";
import { v4 as uuidv4 } from "uuid";
import CustomRadio from "../CustomRadio";
import { useSocket } from "@/contexts/SocketContext";
import { useRouter } from "next/navigation";
import { IRoomGame } from "@/app/room/[id]/types";
import { IFormOfRoom, IRoomObjects } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const Rooms = () => {
  const [rooms, setRooms] = useState<IRoomObjects>({});
  const socket = useSocket();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const router = useRouter();
  const { username } = useAuth();
  const [roomData, setRoomData] = useState<IFormOfRoom>({
    room: "",
    numberOfPlayers: 2,
    typeOfGame: "classic",
    goalsToWin: 5,
    players: [],
    closed: "",
    id: "",
  } as IFormOfRoom);

  useEffect(() => {
    socket?.on("roomCreated", (room: IRoomGame) => {
      setRooms((currentRooms) => ({ ...currentRooms, [room.id]: room }));
    });

    socket?.on("roomUpdated", (rooms: IRoomGame) => {
      setRooms((prev) => {
        return {
          ...prev,
          [rooms.id]: rooms,
        };
      });
    });

    socket?.on("allRooms", (rooms: IRoomObjects) => {
      setRooms(rooms);
    });
  }, [socket]);

  const onCreateRooms = () => {
    const id = uuidv4();
    socket?.emit(
      "createRoom",
      {
        owner: username,
        room: roomData.room,
        numberOfPlayers: roomData.numberOfPlayers,
        typeOfGame: roomData.typeOfGame,
        goalsToWin: roomData.goalsToWin,
        players: [],
        closed: roomData.closed,
        id: id,
        teams: {
          red: {
            players: [],
          },
          blue: {
            players: [],
          },
        },
      },
      (response: string) => {
        if (response === "success") {
          setRoomData({} as IFormOfRoom);
          router.push(`/room/${id}`);
        }
      }
    );
  };

  const createRooms = () => {
    return (
      <div className="flex flex-col px-6 gap-6">
        <Input
          label="Nome da sala"
          type="text"
          value={roomData.room}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRoomData({ ...roomData, room: e.target.value })
          }
          color="white"
        />

        <CustomRadio
          label={"Quantidade de players"}
          values={[2, 4, 6, 8]}
          name="playersAmount"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRoomData({
              ...roomData,
              numberOfPlayers: parseInt(e.target.value) as 2 | 4 | 6 | 8,
            })
          }
        ></CustomRadio>

        <CustomRadio
          label={"Gols para vencer"}
          values={[3, 5, 15]}
          name="matchgoalsToWin"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRoomData({
              ...roomData,
              goalsToWin: parseInt(e.target.value),
            })
          }
        ></CustomRadio>
      </div>
    );
  };

  const roomsList = () => {
    return (
      <div className={classNames([styles.roomsList])}>
        <div className="relative text-white overflow-x-auto sm:rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white uppercase">
              <tr>
                <th scope="col" className=" px-6 py-3">
                  Nome da sala
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex items-center">Players</div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex items-center">Segurança</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.values(rooms).map((room: IRoomGame) => (
                <tr
                  className="border-b border-white cursor-pointer"
                  onClick={() => router.push(`room/${room.id}`)}
                >
                  <th scope="row" className=" px-6 py-4 font-medium whitespace-nowrap">
                    {room.room}
                  </th>
                  <td className="px-6  py-4">
                    {room.teams.blue.players.length + room.teams.red.players.length}/
                    {room.numberOfPlayers}
                  </td>
                  <td className="px-6  py-4">{room.isClosed ? "Fechada" : "Aberta"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className={classNames(["bg-dark-purple rounded-xl  pt-4", styles.rooms])}>
      {isCreatingRoom ? createRooms() : roomsList()}
      <div className="m-6 flex align-middle flex-col justify-between">
        <div className="flex">
          {isCreatingRoom && (
            <button
              onClick={() => setIsCreatingRoom(false)}
              className="text-white py-2 px-7 rounded-full w-full"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={() => {
              isCreatingRoom ? onCreateRooms() : setIsCreatingRoom(true);
            }}
            className="bg-white py-2 px-7 rounded-full text-darkest-purple w-full"
          >
            {isCreatingRoom ? "Confirmar" : "Criar sala"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
