"use client";

import classNames from "classnames";
import styles from "./styles.module.css";
import Image from "next/legacy/image";
import logo from "../../../public/assets/logo.svg";
import { useState } from "react";
import Input from "@/components/Input";
import Link from "next/link";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="grid-12">
      <div
        className={classNames([
          "xs-12 sm-6 md-5 lg-4 xl-3 2xl-2 p-10 bg-white",
          styles.formLoginShell,
        ])}
      >
        <Image layout="fixed" src={logo} alt="Logo" width={100} height={60} />
        <h1 className="text-lime-700 text-3xl mt-16">Logue com a sua conta!</h1>
        <h5 className="text-black font-bold text-sm mt-6">
          Não tem uma conta?{" "}
          <Link href="/signup" className="text-main-color-light cursor-pointer">
            Crie uma!
          </Link>
        </h5>
        <Input
          className="mt-6"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          label="Usuário"
          type="text"
        ></Input>
        <Input
          className="mt-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Senha"
          type="password"
        ></Input>
        <button className="bg-main-color uppercase tracking-widest text-white font-bold text-sm rounded-md p-2 mt-3 w-full">
          login
        </button>
      </div>
    </div>
  );
}
