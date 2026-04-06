import { SFX_BOUMP_SOUND } from "@/constants"
import { useSocketContext } from "@/context/socket"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import useSound from "use-sound"

export default function Start({ data: { time, subject } }) {
  const { socket } = useSocketContext()
  const [showTitle, setShowTitle] = useState(true)
  const [cooldown, setCooldown] = useState(time)
  const [bounceKey, setBounceKey] = useState(0) // для резкого "прыжка" цифры каждый тик

  const [sfxBoump] = useSound(SFX_BOUMP_SOUND, { volume: 0.3 })

  useEffect(() => {
    socket.on("game:startCooldown", () => {
      sfxBoump()
      setShowTitle(false)
    })

    socket.on("game:cooldown", (sec) => {
      sfxBoump()
      setCooldown(sec)
      setBounceKey((prev) => prev + 1) // каждый тик — новая анимация прыжка
    })

    return () => {
      socket.off("game:startCooldown")
      socket.off("game:cooldown")
    }
  }, [sfxBoump, socket])

  return (
    <section className="relative mx-auto flex h-full w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <AnimatePresence mode="wait">
        {/* ===== ЭКРАН НАЗВАНИЯ ТЕМЫ ===== */}
        {showTitle && (
          <motion.div
            key="title"
            initial={{ opacity: 0, scale: 0.4, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.3, rotate: 12 }}
            transition={{ type: "spring", stiffness: 180, damping: 15, duration: 0.1 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-6 rounded-3xl border border-white/10 bg-white/5 px-14 py-10 backdrop-blur-3xl shadow-2xl">
              {/* Эмодзи с отдельным поп-эффектом */}
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, delay: 0.2 }}
                className="text-7xl drop-shadow-2xl"
              >
                🎯
              </motion.span>

              <h2 className="max-w-3xl text-6xl font-black tracking-[-2px] text-white drop-shadow-2xl md:text-7xl">
                {subject}
              </h2>
            </div>
          </motion.div>
        )}

        {/* ===== ЭКРАН ОБРАТНОГО ОТСЧЁТА ===== */}
        {!showTitle && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col items-center"
          >
            <div className="relative flex h-96 w-96 items-center justify-center">
              {/* Внешнее свечение / glow-кольцо */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute h-[380px] w-[380px] rounded-full border-8 border-transparent border-t-violet-400/30 border-r-fuchsia-400/30"
              />

              {/* Основное вращающееся кольцо (ускоряется ближе к концу) */}
              <motion.div
                animate={{ rotate: (time - cooldown) * 36 }}
                transition={{ duration: 0.6, ease: "linear" }}
                className="absolute h-96 w-96 rounded-full border-8 border-transparent border-t-violet-400 border-r-fuchsia-500 shadow-[0_0_60px_-10px] shadow-violet-400"
              />

              {/* Внутренний стеклянный круг */}
              <div className="relative z-10 flex h-72 w-72 items-center justify-center rounded-full border border-white/30 bg-white/5 backdrop-blur-3xl shadow-2xl">
                <motion.div
                  key={bounceKey} // ← каждый тик цифра заново анимируется
                  initial={{ scale: 0.6, y: -30 }}
                  animate={{ scale: 1.15, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 8,
                    mass: 0.8,
                  }}
                  className="flex flex-col items-center text-center"
                >
                  <span
                    className={`text-[6.5rem] font-black tracking-[-4px] text-white drop-shadow-2xl md:text-[7.5rem] ${
                      cooldown <= 5 ? "text-red-400" : ""
                    }`}
                  >
                    {cooldown}
                  </span>
                  <span className="text-2xl font-medium text-white/70 tracking-widest">
                    СЕКУНД
                  </span>
                </motion.div>
              </div>

              {/* Маленькое пульсирующее кольцо внутри при малом времени */}
              {cooldown <= 5 && (
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="absolute h-80 w-80 rounded-full border-4 border-red-400/40"
                />
              )}
            </div>

            {/* Надпись под таймером */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 text-2xl font-bold tracking-[3px] text-white/80"
            >
              ВОПРОС НАЧИНАЕТСЯ
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}