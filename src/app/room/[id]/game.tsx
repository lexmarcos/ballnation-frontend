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

  const [keysPressed, setKeysPressed] = useState<string>("");

  const socketMoveByKeys = {
    w: socket?.emit("move", { move: "up", username, room }),
    a: socket?.emit("move", { move: "left", username, room }),
    s: socket?.emit("move", { move: "down", username, room }),
    d: socket?.emit("move", { move: "right", username, room }),
  };

  useTick(delta => {
    console.log(delta)
  });

  return (
    <div
      className={styles.gameContent}
      autoFocus
      tabIndex={-1}
    >
      {gameState.ballPosition && (
        <Stage width={1280} height={720}>
          <Graphics
            draw={(g) => {
              g.clear();
              g.lineStyle(0);
              g.beginFill("#FFFFFF", 1);
              g.drawCircle(
                gameState.ballPosition.x,
                gameState.ballPosition.y,
                5
              );
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
