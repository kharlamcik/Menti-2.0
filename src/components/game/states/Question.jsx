import { SFX_SHOW_SOUND } from "@/constants"
import { motion } from "framer-motion"
import { useEffect } from "react"
import useSound from "use-sound"

export default function Question({ data: { question, image, cooldown } }) {
  const [sfxShow] = useSound(SFX_SHOW_SOUND, { volume: 0.5 })

  useEffect(() => {
    sfxShow()
  }, [sfxShow])

  return (
    <section className="relative mx-auto flex h-full w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-8">
      {/* Основной glassmorphism блок */}
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-10">
          {/* Текст вопроса */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-4xl font-bold leading-tight tracking-tighter text-white drop-shadow-md md:text-5xl lg:text-6xl"
          >
            {question}
          </motion.h2>

          {/* Картинка — строго по центру в красивом блоке */}
          {!!image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex w-full max-w-3xl justify-center"
            >
              <div className="relative w-full rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
                <img
                  src={image}
                  alt="Иллюстрация вопроса"
                  className="mx-auto max-h-[420px] w-auto rounded-2xl object-contain shadow-inner"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Прогресс-бар таймера (внизу) */}
      <div className="mt-auto w-full max-w-4xl pt-16">
        <div className="h-3 w-full overflow-hidden rounded-3xl bg-white/10 backdrop-blur-md">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: cooldown, ease: "linear" }}
            className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500"
          />
        </div>
      </div>
    </section>
  )
}