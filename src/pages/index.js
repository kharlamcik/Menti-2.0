import Image from "next/image"
import { Montserrat } from "next/font/google"
import Form from "@/components/Form"
import Button from "@/components/Button"
import Input from "@/components/Input"
import logo from "@/assets/lo.gif"
import { useEffect, useState } from "react"
import Loader from "@/components/Loader"
import { usePlayerContext } from "@/context/player"
import Room from "@/components/game/join/Room"
import Username from "@/components/game/join/Username"
import { useSocketContext } from "@/context/socket"
import toast from "react-hot-toast"
import background from "@/assets/735d73725f77188e554756b5e11a2bf1.gif"

export default function Home() {
  const { player, dispatch } = usePlayerContext()
  const { socket } = useSocketContext()

  useEffect(() => {
    socket.on("game:errorMessage", (message) => {
      toast.error(message)
    })

    return () => {
      socket.off("game:errorMessage")
    }
  }, [])

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center">
      {/* Фон и затемнение */}
          <div className="absolute left-0 top-0 -z-0 h-full w-full bg-black opacity-0" />
          <Image
            src={background}
            alt="background"
            className="absolute left-0 top-0 -z-20 h-full w-full object-cover opacity-80"
          />

      <Image src={logo} className="mb-6 h-32 w-80 rounded " alt="logo" />

      {!player ? <Room /> : <Username />}
    </section>
  )
}
