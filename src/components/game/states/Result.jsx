import CricleCheck from "@/components/icons/CricleCheck"
import CricleXmark from "@/components/icons/CricleXmark"
import { SFX_RESULTS_SOUND } from "@/constants"
import { usePlayerContext } from "@/context/player"
import { motion } from "framer-motion"
import { useEffect } from "react"
import useSound from "use-sound"

export default function Result({
  data: { correct, message, points, myPoints, rank, aheadOfMe },
}) {
  const { dispatch } = usePlayerContext()

  const [sfxResults] = useSound(SFX_RESULTS_SOUND, { volume: 0.2 })

  useEffect(() => {
    dispatch({
      type: "UPDATE",
      payload: { points: myPoints },
    })

    sfxResults()
  }, [sfxResults, dispatch, myPoints])

  return (
    <section className="relative mx-auto flex h-full w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-8">
      {/* Glassmorphism контейнер */}
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-10 shadow-2xl text-center">
        {/* Большая иконка с анимацией */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
          className="mx-auto mb-8 flex h-52 w-52 items-center justify-center"
        >
          {correct ? (
            <CricleCheck className="h-full w-full text-emerald-400 drop-shadow-2xl" />
          ) : (
            <CricleXmark className="h-full w-full text-red-400 drop-shadow-2xl" />
          )}
        </motion.div>

        {/* Сообщение */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-2 text-4xl font-bold tracking-tighter text-white drop-shadow-md"
        >
          {message}
        </motion.h2>

        {/* Ранг */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-xl font-medium text-white/80"
        >
          Ты в топе <span className="font-bold text-white">#{rank}</span>
          {aheadOfMe && (
            <span className="text-white/70"> • впереди ещё {aheadOfMe}</span>
          )}
        </motion.p>

        {/* Очки (только при правильном ответе) */}
        {correct && points > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="mx-auto mt-8 inline-flex items-center gap-3 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-3xl font-black text-white shadow-xl"
          >
            <span className="text-4xl">+{points}</span>
            <span className="text-xl font-medium opacity-75">pts</span>
          </motion.div>
        )}
      </div>
    </section>
  )
}