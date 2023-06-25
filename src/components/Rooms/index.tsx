"use client";
import classNames from "classnames";
import styles from "./styles.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { stringToColor } from "@/utils/generateHexColor";
import { useAuth } from "@/contexts/AuthContext";
import Input from "@/components/Input";
import { v4 as uuidv4 } from "uuid";
import CustomRadio from "../CustomRadio";

export interface IRoom {
  room: string;
  numberOfPlayers: 2 | 4 | 6 | 8;
  typeOfGame: "classic" | "withPowerUps";
  duration: number;
  players: string[];
  closed: string;
  id: string;
}

interface IRoomsObjects {
  [key: string]: IRoom;
}

const Rooms = () => {
  const { username, token } = useAuth();
  const [rooms, setRooms] = useState<IRoomsObjects>({});
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomData, setRoomData] = useState<IRoom>({
    room: "",
    numberOfPlayers: 2,
    typeOfGame: "classic",
    duration: 5,
    players: [],
    closed: "",
    id: "",
  } as IRoom);

  useEffect(() => {
    const socketConnect = io("http://localhost:9000", {
      query: {
        token,
      },
    });

    setSocket(socketConnect);

    socketConnect.on("roomCreated", (room: IRoom) => {
      console.log(room);
      setRooms((currentRooms) => ({ ...currentRooms, [room.id]: room }));
    });

    socketConnect.on("connect_error", (error) => {
      console.log(error.message); // vai imprimir "Authentication error" se o JWT for inválido
    });

    return () => {
      socketConnect.disconnect();
    };
  }, [token]);

  const onCreateRooms = () => {
    socket?.emit(
      "createRoom",
      {
        room: roomData.room,
        numberOfPlayers: roomData.numberOfPlayers,
        typeOfGame: roomData.typeOfGame,
        duration: roomData.duration,
        players: [],
        closed: roomData.closed,
        id: uuidv4(),
      },
      (response: string) => {
        if (response === "success") {
          setIsCreatingRoom(false);
          setRoomData({} as IRoom);
        }
      }
    );
  };

  const createRooms = () => {
    return (
      <div className="flex flex-col px-6">
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
          //setRoomData={setRoomData}
        ></CustomRadio>

        <select
          value={roomData.typeOfGame}
          onChange={(e) =>
            setRoomData({
              ...roomData,
              typeOfGame: e.target.value as "classic" | "withPowerUps",
            })
          }
          className="mt-3 bg-darkest-purple outline-none text-white rounded-lg p-3"
        >
          <option value="classic">Clássico</option>
          <option value="withPowerUps">Com poderes</option>
        </select>

        {/*<select
          value={roomData.numberOfPlayers}
          onChange={(e) =>
            setRoomData({
              ...roomData,
              numberOfPlayers: parseInt(e.target.value) as 2 | 4 | 6 | 8,
            })
          }
          className="mt-3 bg-darkest-purple outline-none text-white rounded-lg p-3"
        >
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="6">6</option>
          <option value="8">8</option>{" "}
        </select>*/}

        <CustomRadio
          label={"Duração da partida"}
          values={[5, 10, 15]}
          name="matchDuration"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRoomData({
              ...roomData,
              duration: parseInt(e.target.value) as 2 | 4 | 6 | 8,
            })
          }
          //setRoomData={setRoomData}
        ></CustomRadio>

        {/*<select
          value={roomData.duration}
          onChange={(e) =>
            setRoomData({
              ...roomData,
              duration: parseInt(e.target.value),
            })
          }
          className="mt-3 bg-darkest-purple outline-none text-white rounded-lg p-3"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>*/}
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
              {Object.values(rooms).map((room: IRoom) => (
                <tr className="border-b border-white">
                  <th
                    scope="row"
                    className=" px-6 py-4 font-medium whitespace-nowrap"
                  >
                    {room.room}
                  </th>
                  <td className="px-6  py-4">
                    {room.players.length}/{room.numberOfPlayers}
                  </td>
                  <td className="px-6  py-4">
                    {room.closed ? "Fechada" : "Aberta"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div
      className={classNames(["bg-dark-purple rounded-xl  pt-4", styles.rooms])}
    >
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
