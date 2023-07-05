"use client";
import React, { useRef, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Stage, Container, Sprite, Text, useTick } from '@pixi/react';

interface Position {
  x: number;
  y: number;
}

const GamePage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ballPosition, setBallPosition] = useState<Position>({ x: 450, y: 300 });

  const draw = (ctx: CanvasRenderingContext2D) => {
    // Limpar tela
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Desenhar o campo
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Desenhar os jogadores
    ctx.fillStyle = "blue";
    ctx.fillRect(100, 100, 50, 50);
    ctx.fillStyle = "red";
    ctx.fillRect(800, 100, 50, 50);

    // Desenhar a bola
    ctx.beginPath();
    console.log(ballPosition);
    ctx.arc(ballPosition.x, ballPosition.y, 20, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();
  };

  const updateGame = (frameCount: number, animationFrameId: number) => {
    frameCount++;
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        draw(context);
      }
    }
    // console.log(ballPosition);
    animationFrameId = requestAnimationFrame(() => updateGame(frameCount, animationFrameId));
  };

  const handleMovePlayer = (key: string) => {
    switch (key) {
      case "w":
        setBallPosition((prevState) => ({ x: prevState.x, y: prevState.y - 20 }));
        console.log(ballPosition);
        break;
      case "a":
        setBallPosition((prevState) => ({ x: prevState.x - 20, y: prevState.y }));
        break;
      case "s":
        setBallPosition((prevState) => ({ x: prevState.x, y: prevState.y + 20 }));
        break;
      case "d":
        setBallPosition((prevState) => ({ x: prevState.x + 20, y: prevState.y }));
        break;
      default:
        break;
    }
  };

  const iter = useRef(0);


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
<Stage width={1280} height={720}>
      <Sprite
        image="https://pixijs.io/pixi-react/img/bunny.png"
        x={ballPosition.x}
        y={ballPosition.y}
        
        anchor={{ x: 0.5, y: 0.5 }}
      />

    </Stage>
    </div>
  );
};

export default GamePage;
