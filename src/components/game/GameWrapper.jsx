import Image from "next/image"
import { usePlayerContext } from "@/context/player"
import { useSocketContext } from "@/context/socket"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import background from "@/assets/e285661a023fb83c8d7f975980422c22.gif" // основной фон
import backgroundd from "@/assets/735d73725f77188e554756b5e11a2bf1.gif" // анимированный фон (если хочешь)
import CustomButton from "@/components/QuizForm/components/CustomButton"

export default function GameWrapper({ children, textNext, onNext, manager }) {
  const { socket } = useSocketContext()
  const { player, dispatch } = usePlayerContext()
  const router = useRouter()

  const [questionState, setQuestionState] = useState(null)

  useEffect(() => {
    socket.on("game:kick", () => {
      dispatch({ type: "LOGOUT" })
      router.replace("/")
    })

    socket.on("game:updateQuestion", ({ current, total }) => {
      setQuestionState({ current, total })
    })

    return () => {
      socket.off("game:kick")
      socket.off("game:updateQuestion")
    }
  }, [dispatch, router])

  return (
    <section className="relative flex min-h-screen w-full flex-col">
      {/* Фон */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={background}
          alt="background"
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        {/* Дополнительный анимированный слой (по желанию) */}
        
      </div>

      {/* Верхняя панель */}
      <div className="relative z-20 flex w-full items-center justify-between p-4">
        {questionState && (
          <div className="flex items-center rounded-2xl bg-white/10 px-5 py-2.5 text-lg font-bold text-white backdrop-blur-md border border-white/10">
            {`${questionState.current} / ${questionState.total}`}
          </div>
        )}

        {manager && (
          <CustomButton
            onClick={onNext}
            color="bg-gradient-to-r from-violet-600 to-indigo-600"
            hoverColor="from-violet-700 to-indigo-700"
            size="md"
            className="font-medium shadow-lg"
          >
            {textNext}
          </CustomButton>
        )}
      </div>

      {/* Основной контент */}
      <div className="relative z-10 flex flex-1 flex-col">
        {children}
      </div>

      {/* Нижняя панель игрока (только для игроков) */}
      {!manager && player && (
        <div className="relative z-20 mx-4 mb-6 flex items-center justify-between rounded-3xl bg-white/10 px-6 py-4 backdrop-blur-2xl border border-white/10 shadow-2xl">
          <p className="text-lg font-medium text-white">
            {player.username}
          </p>

          <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-2 text-lg font-bold text-white">
            {player.points}
            <span className="text-yellow-400">★</span>
          </div>
        </div>
      )}
    </section>
  )
}