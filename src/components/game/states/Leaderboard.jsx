import React from "react"
import { motion } from "framer-motion"

export default function Leaderboard({ data: { leaderboard } }) {
  return (
    <section className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-8">
      {/* Glassmorphism контейнер */}
      <div className="w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl">
        {/* Заголовок в стиле проекта */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 rounded-3xl border border-white/10 bg-white/10 px-8 py-4 backdrop-blur-xl">
            <span className="text-4xl">🏆</span>
            <h2 className="text-5xl font-bold tracking-tighter text-white drop-shadow-md">
              Leaderboard
            </h2>
            <span className="text-4xl">🏆</span>
          </div>
        </div>

        <div className="space-y-3">
          {leaderboard.map(({ username, points }, index) => {
            const rank = index + 1

            // Градиенты и цвета для топ-3 (в стиле проекта — яркие, но гармоничные)
            const getRankStyle = (rank) => {
              if (rank === 1) return "from-yellow-400 via-amber-400 to-orange-500 text-yellow-400"
              if (rank === 2) return "from-gray-300 via-slate-300 to-zinc-400 text-gray-300"
              if (rank === 3) return "from-amber-600 via-orange-600 to-red-600 text-amber-600"
              return "from-white/80 to-white/60 text-white/80"
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.07, type: "spring", stiffness: 300 }}
                className="group flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-7 py-5 transition-all hover:border-white/30 hover:bg-white/10 hover:shadow-xl"
              >
                <div className="flex items-center gap-5">
                  {/* Ранг (кружок как в QuizListPage) */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${getRankStyle(
                      rank
                    )} text-3xl font-black shadow-lg transition-transform group-hover:scale-110`}
                  >
                    {rank <= 3 ? (
                      rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"
                    ) : (
                      <span className="text-2xl">#{rank}</span>
                    )}
                  </div>

                  {/* Имя пользователя */}
                  <span className="text-2xl font-bold text-white transition-colors group-hover:text-violet-200">
                    {username}
                  </span>
                </div>

                {/* Очки */}
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-4xl font-black bg-gradient-to-r ${getRankStyle(
                      rank
                    )} bg-clip-text text-transparent`}
                  >
                    {points}
                  </span>
                  <span className="text-xl font-medium text-white/60">pts</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}