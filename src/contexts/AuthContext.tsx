"use client";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface IAuthContext {
  token: string | null;
  username: string | null;
  saveToken: (token: string) => void;
  saveUsername: (username: string) => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const saveUsername = (username: string) => {
    localStorage.setItem("username", username);
    setUsername(username);
  };

  const saveToken = (userToken: string) => {
    localStorage.setItem("token", userToken);
    setToken(userToken);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token) {
      saveToken(token);
    } else {
      router.push("/login", {
        query: {
          error: "You must be logged in to access this page",
        },
      });
    }
    if (username) {
      setUsername(username);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, saveToken, username, saveUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
