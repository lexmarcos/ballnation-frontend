"use client";

import classNames from "classnames";
import styles from "./styles.module.css";
import Image from "next/legacy/image";
import logo from "../../../public/assets/logo.svg";
import players from "../../../public/assets/players.svg";
import { useState } from "react";
import Input from "@/components/Input";
import Link from "next/link";
import { api } from "@/services/api/api";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const signup = async () => {
    const res = await api.auth.signup(email, username, password);
    console.log(res.status);
    if (res.status === 200) {
      router.push("/login");
    }
    return res;
  };

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
        <button
          onClick={signup}
          className="bg-main-color uppercase tracking-widest text-white font-bold text-sm rounded-md p-2 mt-3 w-full"
        >
          Criar conta
        </button>
      </div>
      <div className="bg-secondary-green-color xl-9 xs-0 sm-6 md-7 lg-8 2xl-10 flex justify-center align-middle">
        <div className={classNames([styles["side-art"]])}>
          <Image layout="fill" src={players} alt="Logo" />
        </div>
      </div>
    </div>
  );
}
