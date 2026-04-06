import { usePlayerContext } from "@/context/player"
import { useEffect, useState } from "react"
import { socket } from "@/context/socket"
import Image from "next/image"
import background from "@/assets/e285661a023fb83c8d7f975980422c22.gif"
import logo from "@/assets/8344b8154034ae498c1768b7a733805c.gif"
import CustomButton from "@/components/QuizForm/components/CustomButton"

export default function Room() {
  const { player, dispatch } = usePlayerContext()
  const [roomId, setRoomId] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    socket.emit("player:checkRoom", roomId)
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin()
    }
  }

  useEffect(() => {
    socket.on("game:successRoom", (roomId) => {
      dispatch({ type: "JOIN", payload: roomId })
    })

    return () => {
      socket.off("game:successRoom")
    }
  }, [])

  return (
    <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl">
          <h2 className="mb-8 text-center text-2xl font-semibold text-white">
            Присоединиться к викторине
          </h2>

          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Введите PIN-код"
            maxLength={10}
            className="mb-4 w-full rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-center text-2xl tracking-widest text-white placeholder-gray-500 focus:border-violet-400 focus:outline-none"
          />

          <CustomButton
            onClick={handleLogin}
            disabled={loading || !roomId.trim()}
            color="bg-gradient-to-r from-violet-600 to-indigo-600"
            hoverColor="bg-gradient-to-r from-violet-700 to-indigo-700"
            size="lg"
            className="w-full font-medium"
          >
            {loading ? "Проверка..." : "Присоединиться"}
          </CustomButton>

          <p className="mt-6 text-center text-xs text-gray-400">
            PIN-код обычно состоит из 4–6 символов
          </p>
        </div>
      </div>
  )
}
