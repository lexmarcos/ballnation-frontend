"use client";

import classNames from "classnames";
import styles from "./styles.module.css";
import Image from "next/legacy/image";
import logo from "../../../public/assets/logo.svg";
import { useState } from "react";
import Input from "@/components/Input";
import Link from "next/link";
export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  return (
    <div className="grid-12">
      <div
        className={classNames([
          "xs-12 sm-6 md-5 lg-4 xl-3 2xl-2 p-10 bg-white",
          styles.formLoginShell,
        ])}
      >
        <Image layout="fixed" src={logo} alt="Logo" width={100} height={60} />
        <h1 className="text-lime-700 text-3xl mt-16">Crie sua conta</h1>
        <h5 className="text-black font-bold text-sm mt-6">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-main-color-light cursor-pointer">
            Entre aqui!
          </Link>
        </h5>
        <form action="">
          <Input
            className="mt-6"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            type="email"
            required
          ></Input>
          <Input
            className="mt-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            label="Usuário"
            type="text"
            required
          ></Input>
          <Input
            className="mt-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Senha"
            type="password"
            required
          ></Input>
        </form>
        <button
          type="submit"
          className="bg-main-color uppercase tracking-widest text-white font-bold text-sm rounded-md p-2 mt-3 w-full"
        >
          Criar conta
        </button>
      </div>
    </div>
  );
}
