import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactConfetti from "react-confetti"
import useScreenSize from "@/hook/useScreenSize"
import {
  SFX_PODIUM_FIRST,
  SFX_PODIUM_SECOND,
  SFX_PODIUM_THREE,
  SFX_SNEAR_ROOL,
} from "@/constants"
import useSound from "use-sound"

export default function Podium({ data: { subject, top } }) {
  const [apparition, setApparition] = useState(0)

  const { width, height } = useScreenSize()

  const [sfxtThree] = useSound(SFX_PODIUM_THREE, { volume: 0.2 })
  const [sfxSecond] = useSound(SFX_PODIUM_SECOND, { volume: 0.2 })
  const [sfxRool, { stop: sfxRoolStop }] = useSound(SFX_SNEAR_ROOL, { volume: 0.2 })
  const [sfxFirst] = useSound(SFX_PODIUM_FIRST, { volume: 0.2 })

  // Звуки по этапам появления
  useEffect(() => {
    switch (apparition) {
      case 4:
        sfxRoolStop()
        sfxFirst()
        break
      case 3:
        sfxRool()
        break
      case 2:
        sfxSecond()
        break
      case 1:
        sfxtThree()
        break
      default:
        break
    }
  }, [apparition, sfxFirst, sfxSecond, sfxtThree, sfxRool, sfxRoolStop])

  // Автоматическая последовательность появления
  useEffect(() => {
    if (top.length < 3) {
      setApparition(4)
      return
    }

    const interval = setInterval(() => {
      setApparition((prev) => {
        if (prev >= 4) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 1800)

    return () => clearInterval(interval)
  }, [top.length])

  const getRankStyle = (rank) => {
    if (rank === 1) return "from-yellow-400 via-amber-300 to-orange-500 border-amber-400"
    if (rank === 2) return "from-zinc-300 via-slate-300 to-gray-400 border-zinc-400"
    if (rank === 3) return "from-amber-700 via-orange-700 to-red-700 border-amber-800"
    return "from-white/70 to-white/40 border-white/60"
  }

  return (
    <>
      {/* Конфетти только для победителя */}
      {apparition >= 4 && (
        <ReactConfetti
          width={width}
          height={height}
          className="h-full w-full"
          numberOfPieces={600}
          recycle={false}
          gravity={0.15}
        />
      )}

      {/* Spotlight (оставляем оригинальный класс, если он есть в глобальных стилях) */}
      {apparition >= 3 && top.length >= 3 && (
        <div className="absolute inset-0 min-h-screen w-full overflow-hidden pointer-events-none">
          <div className="spotlight" />
        </div>
      )}

      <section className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-12">
        {/* Glass-заголовок в едином стиле проекта */}
        <div className="mb-10 inline-flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-10 py-6 backdrop-blur-2xl shadow-2xl">
          <span className="text-5xl drop-shadow-md">🏆</span>
          <h2 className="text-5xl font-bold tracking-tighter text-white drop-shadow-md">
            Подиум
          </h2>
        </div>

        <p className="mb-16 text-center text-3xl font-medium text-white/80 tracking-wide">
          {subject}
        </p>

        {/* Сам подиум */}
        <div className="flex w-full max-w-[920px] items-end justify-center gap-6 md:gap-8">
          {/* 2 место */}
          {top[1] && (
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{
                y: apparition >= 2 ? 0 : 200,
                opacity: apparition >= 2 ? 1 : 0,
              }}
              transition={{ duration: 0.8, type: "spring", stiffness: 280 }}
              className="flex flex-1 flex-col items-center"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: apparition >= 4 ? 1 : 0 }}
                className="mb-3 text-3xl font-bold text-white drop-shadow-lg"
              >
                {top[1].username}
              </motion.p>

              <div
                className={`w-full rounded-3xl border-2 ${getRankStyle(
                  2
                )} bg-gradient-to-b from-white/10 to-white/5 p-2 shadow-2xl backdrop-blur-xl`}
              >
                <div className="flex h-80 flex-col items-center justify-end rounded-3xl bg-gradient-to-b from-zinc-800/70 to-zinc-900/90 p-6 text-center">
                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${getRankStyle(
                      2
                    )} text-5xl font-black shadow-inner`}
                  >
                    🥈
                  </div>
                  <p className="text-4xl font-black text-white">{top[1].points}</p>
                  <span className="text-white/60 text-lg">pts</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* 1 место — самое высокое */}
          {top[0] && (
            <motion.div
              initial={{ y: 260, opacity: 0, scale: 0.95 }}
              animate={{
                y: apparition >= 3 ? 0 : 260,
                opacity: apparition >= 3 ? 1 : 0,
                scale: apparition >= 3 ? 1 : 0.95,
              }}
              transition={{ duration: 0.9, type: "spring", stiffness: 260 }}
              className="flex flex-1 flex-col items-center z-10 -mt-8"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: apparition >= 4 ? 1 : 0 }}
                className="mb-3 text-3xl font-bold text-white drop-shadow-lg"
              >
                {top[0].username}
              </motion.p>

              <div
                className={`w-full rounded-3xl border-2 ${getRankStyle(
                  1
                )} bg-gradient-to-b from-white/10 to-white/5 p-2 shadow-2xl backdrop-blur-xl`}
              >
                <div className="flex h-96 flex-col items-center justify-end rounded-3xl bg-gradient-to-b from-amber-900/80 to-amber-950/90 p-6 text-center">
                  <div
                    className={`mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${getRankStyle(
                      1
                    )} text-6xl font-black shadow-inner ring-4 ring-white/30`}
                  >
                    🥇
                  </div>
                  <p className="text-5xl font-black text-white">{top[0].points}</p>
                  <span className="text-white/70 text-xl">pts</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3 место */}
          {top[2] && (
            <motion.div
              initial={{ y: 160, opacity: 0 }}
              animate={{
                y: apparition >= 1 ? 0 : 160,
                opacity: apparition >= 1 ? 1 : 0,
              }}
              transition={{ duration: 0.7, type: "spring", stiffness: 300 }}
              className="flex flex-1 flex-col items-center"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: apparition >= 4 ? 1 : 0 }}
                className="mb-3 text-3xl font-bold text-white drop-shadow-lg"
              >
                {top[2].username}
              </motion.p>

              <div
                className={`w-full rounded-3xl border-2 ${getRankStyle(
                  3
                )} bg-gradient-to-b from-white/10 to-white/5 p-2 shadow-2xl backdrop-blur-xl`}
              >
                <div className="flex h-64 flex-col items-center justify-end rounded-3xl bg-gradient-to-b from-amber-800/70 to-amber-900/90 p-6 text-center">
                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${getRankStyle(
                      3
                    )} text-5xl font-black shadow-inner`}
                  >
                    🥉
                  </div>
                  <p className="text-4xl font-black text-white">{top[2].points}</p>
                  <span className="text-white/60 text-lg">pts</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}