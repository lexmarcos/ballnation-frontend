"use client";
import React, { createContext, useState, useEffect, FC, ReactNode, useContext } from "react";
import { Socket, io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

// Crie o Context
const SocketContext = createContext<Socket | null>(null);

// Crie o Provider do componente
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { token } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!!token) {
      const newSocket = io("http://localhost:9000", {
        query: {
          token,
        },
      });

      newSocket.on("connect_error", (error) => {
        router.push("/login");
      });

      console.log(newSocket);
      setSocket(newSocket);
    }
  }, [token]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const socket = useContext(SocketContext);

  return socket;
};

export default SocketContext;
