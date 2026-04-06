import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { socket } from "@/context/socket"
import logo from "@/assets/8344b8154034ae498c1768b7a733805c.gif"
import background from "@/assets/e285661a023fb83c8d7f975980422c22.gif"
import CustomButton from "@/components/QuizForm/components/CustomButton"

export default function ManagerPassword() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // Автозаполнение пароля из URL
  useEffect(() => {
    const { password: urlPassword } = router.query
    if (urlPassword) {
      setPassword(urlPassword)
    }
  }, [router.query])

  const handleCreate = () => {
    if (!password.trim()) {
      toast.error("Введите пароль")
      return
    }

    setLoading(true)
    socket.emit("manager:createRoom", password.trim().toUpperCase())
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleCreate()
    }
  }

  useEffect(() => {
    socket.on("game:errorMessage", (message) => {
      toast.error(message)
      setLoading(false)
    })

    return () => {
      socket.off("game:errorMessage")
    }
  }, [])

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center">
      {/* Фон */}
      <div className="absolute left-0 top-0 -z-10 h-full w-full bg-black opacity-40" />
      <Image
        src={background}
        alt="background"
        className="absolute left-0 top-0 -z-20 h-full w-full object-cover opacity-90"
      />

      <Image src={logo} className="mb-6 h-32 w-80 rounded" alt="logo" />

      
        <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl">
          <h2 className="mb-8 text-center text-2xl font-semibold text-white">
            🚀 Запуск викторины
          </h2>

          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Введите пароль викторины"
            className="mb-4 w-full rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-lg text-white placeholder-gray-400 focus:border-violet-400 focus:outline-none"
          />

          <CustomButton
            onClick={handleCreate}
            disabled={loading || !password.trim()}
            color="bg-gradient-to-r from-violet-600 to-indigo-600"
            hoverColor="from-violet-700 to-indigo-700"
            size="lg"
            className="w-full font-medium"
          >
            {loading ? "Подключение..." : "Войти"}
          </CustomButton>

          <p className="mt-6 text-center text-xs text-gray-400">
            Пароль вводится без пробелов и в верхнем регистре
          </p>
        </div>
      </div>
      
    </section>
  )
}
