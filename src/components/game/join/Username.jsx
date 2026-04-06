import { usePlayerContext } from "@/context/player"
import Form from "@/components/Form"
import Button from "@/components/Button"
import Input from "@/components/Input"
import { useEffect, useState } from "react"
import { useSocketContext } from "@/context/socket"
import { useRouter } from "next/router"
import CustomButton from "@/components/QuizForm/components/CustomButton"

export default function Username() {
  const { socket } = useSocketContext()
  const { player, dispatch } = usePlayerContext()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)

  const handleJoin = () => {
    socket.emit("player:join", { username: username, room: player.room })
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleJoin()
    }
  }

  useEffect(() => {
    socket.on("game:successJoin", () => {
      dispatch({
        type: "LOGIN",
        payload: username,
      })

      router.replace("/game")
    })

    return () => {
      socket.off("game:successJoin")
    }
  }, [username])

  return (
    
    <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl">
          <h2 className="mb-8 text-center text-2xl font-semibold text-white">
            Как вас зовут?
          </h2>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ваше имя"
            className="mb-4 w-full rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-lg text-white placeholder-gray-500 focus:border-violet-400 focus:outline-none"
            maxLength={20}
          />

          <CustomButton
            onClick={handleJoin}
            disabled={loading || !username.trim()}
            color="bg-gradient-to-r from-violet-600 to-indigo-600"
            hoverColor="bg-gradient-to-r from-violet-700 to-indigo-700"
            size="lg"
            className="w-full font-medium"
          >
            {loading ? "Подключаемся..." : "ЛетсГоу"}
          </CustomButton>
        </div>
      </div>
    
  )
}
