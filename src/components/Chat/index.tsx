"use client";
import classNames from "classnames";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { stringToColor } from "@/utils/generateHexColor";
import { useAuth } from "@/contexts/AuthContext";
import { IoSend } from "react-icons/io5";
import { useSocket } from "@/contexts/SocketContext";
import { IMessage } from "./types";

const Chat = () => {
  const { username } = useAuth();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const socket = useSocket();
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket?.emit("joinLobby", { room: "lobby" });

    socket?.on("newMessage", (newMessage: IMessage) => {
      console.log(newMessage);
      setMessages((currentMessages) => [...currentMessages, newMessage]);
    });
  }, [socket]);

  const onSendMessage = () => {
    setMessage("");
    socket?.emit("message", {
      room: "lobby",
      text: message,
      author: username,
    });
  };

  return (
    <div className={classNames(["bg-dark-purple rounded-xl", styles.chat])}>
      <div className={classNames(["px-7 pt-4", styles.chatMessages])}>
        {messages.map((message) => (
          <div className="my-1 text-white" key={message.id}>
            <span style={{ color: stringToColor(message.author) }} className="font-bold">
              {message.author}
            </span>
            : {message.text}
          </div>
        ))}
      </div>
      <div className="m-6 flex align-middle">
        <input
          value={message}
          className="w-full text-white bg-darkest-purple p-4 rounded-full outline-none"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite uma mensagem..."
        />
        <button
          onClick={() => onSendMessage()}
          className="bg-purple-600 py-2 px-7 -ml-12 rounded-full"
        >
          <IoSend color="white"></IoSend>
        </button>
      </div>
    </div>
  );
};

export default Chat;
