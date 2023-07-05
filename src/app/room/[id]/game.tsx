"use client";
import React, { useRef, useEffect, useState, use } from "react";
import styles from "./styles.module.css";
import { Stage, Container, Sprite, Text, useTick, Graphics } from "@pixi/react";
import { useSocket } from "@/contexts/SocketContext";
import { IGameState } from "./types";
import { useAuth } from "@/contexts/AuthContext";

interface Position {
  x: number;
  y: number;
}

interface KeyPressedState {
  [key: string]: boolean;
}

const GamePage = ({ room }: { room: string }) => {
  const socket = useSocket();
  const { username } = useAuth();
  const [gameState, setGameState] = useState<IGameState>({} as IGameState);

  useEffect(() => {
    if (socket) {
      socket.on("gameState", (gameState: IGameState) => {
        setGameState(gameState);
      });
    }
  }, [socket]);

  const [keysPressed, setKeysPressed] = useState<KeyPressedState>({});

  useEffect(() => {
    function downHandler({ key }: KeyboardEvent) {
      setKeysPressed((prevKeys) => ({ ...prevKeys, [key]: true }));
    }

    function upHandler({ key }: KeyboardEvent) {
      setKeysPressed((prevKeys) => ({ ...prevKeys, [key]: false }));
    }

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  useEffect(() => {
    if (keysPressed.w) {
      socket?.emit("move", { move: "up", username, room });
    }
    if (keysPressed.a) {
      socket?.emit("move", { move: "left", username, room });
    }
    if (keysPressed.s) {
      socket?.emit("move", { move: "down", username, room });
    }
    if (keysPressed.d) {
      socket?.emit("move", { move: "right", username, room });
    }
  }, [keysPressed]);

  // const handleMovePlayer = (key: string) => {
  //   switch (key) {
  //     case "w":
  //       socket?.emit("move", { move: "up", username, room });
  //       break;
  //     case "a":
  //       socket?.emit("move", { move: "left", username, room });
  //       break;
  //     case "s":
  //       socket?.emit("move", { move: "down", username, room });
  //       break;
  //     case "d":
  //       socket?.emit("move", { move: "right", username, room });
  //       break;
  //     default:
  //       break;
  //   }
  // };

  useEffect(() => {
    document.addEventListener("keydown", () => console.log("aqui"), false);
  }, []);

  return (
    <div
      className={styles.gameContent}
      autoFocus
      tabIndex={-1}
      // onKeyDown={(e) => {
      //   if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d")
      //     handleMovePlayer(e.key);
      // }}
    >
      {gameState.ballPosition && (
        <Stage width={1280} height={720}>
          <Graphics
            draw={(g) => {
              g.clear();
              g.lineStyle(0);
              g.beginFill("#FFFFFF", 1);
              g.drawCircle(gameState.ballPosition.x, gameState.ballPosition.y, 5);
              g.endFill();
            }}
          />
          {gameState.playersPositions?.map((player) => (
            <Graphics
              draw={(g) => {
                g.clear();
                g.lineStyle(0);
                g.beginFill("#FFFFFF", 1);
                g.drawCircle(player.x, player.y, 20);
                g.endFill();
              }}
            />
          ))}
        </Stage>
      )}
    </div>
  );
};

export default GamePage;
