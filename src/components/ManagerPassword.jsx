import Image from "next/image"
import { usePlayerContext } from "@/context/player"
import Form from "@/components/Form"
import Button from "@/components/Button"
import Input from "@/components/Input"
import { useEffect, useState } from "react"
import { socket } from "@/context/socket"
import logo from "@/assets/8344b8154034ae498c1768b7a733805c.gif"
import toast from "react-hot-toast"
import background from "@/assets/e285661a023fb83c8d7f975980422c22.gif"


export default function ManagerPassword() {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")

  const handleCreate = () => {
    socket.emit("manager:createRoom", password)
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleCreate()
    }
  }

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
    <div className="absolute left-0 top-0 -z-10 h-full w-full bg-black opacity-40" />
    <Image
      src={background}
      alt="background"
      className="absolute left-0 top-0 -z-20 h-full w-full object-cover opacity-90"
    />

    <Image src={logo} className="mb-6 h-32 w-80 rounded" alt="logo" />

    <Form>
      <Input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Пароль от теста"
      />
      <Button onClick={() => handleCreate()}>OK</Button>
    </Form>
  </section>
)

}
