import Image from "next/image"
import Button from "@/components/Button"
import background from "@/assets/background.webp"
import { usePlayerContext } from "@/context/player"
import { useSocketContext } from "@/context/socket"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import backgroundd from "@/assets/735d73725f77188e554756b5e11a2bf1.gif"

export default function GameWrapper({ children, textNext, onNext, manager }) {
  const { socket } = useSocketContext()
  const { player, dispatch } = usePlayerContext()
  const router = useRouter()

  const [questionState, setQuestionState] = useState()

  useEffect(() => {
    socket.on("game:kick", () => {
      dispatch({
        type: "LOGOUT",
      })

      router.replace("/")
    })

    socket.on("game:updateQuestion", ({ current, total }) => {
      setQuestionState({
        current,
        total,
      })
    })

    return () => {
      socket.off("game:kick")
      socket.off("game:updateQuestion")
    }
  }, [])

  return (
    <section className="relative flex min-h-screen w-full flex-col justify-between">
      <div className="fixed left-0 top-0 -z-10 h-full w-full bg-blue-600 opacity-85">
        <Image
          className="pointer-events-none h-full w-full object-cover opacity-60"
          src={background}
          alt="background"
        />
      </div>

      <div className="flex w-full justify-between p-4">
        {questionState && (
          <div className="shadow-inset flex items-center rounded-md bg-white p-2 px-4 text-lg font-bold text-black ">
            {`${questionState.current} / ${questionState.total}`}
          </div>
        )}

        {manager && (
          <Button
            className="self-end bg-white px-4 !text-black transition-all duration-300 hover:scale-95"
            onClick={() => onNext()}
          >
            {textNext}
          </Button>
        )}
      </div>

      {children}

      {!manager && (
        <div className="z-50 flex items-center justify-between bg-white px-4 py-2 text-lg font-bold text-white rounded ml-10 mr-10 mb-4">
          <p className="text-gray-800 hover:scale-105 transition-all duration-300">{!!player && player.username}</p>
          
          <div className="rounded-sm bg-gray-800 px-3 py-1 text-lg hover:scale-105 transition-all duration-300">
            {!!player && player.points}
          </div>
        </div>
      )}
    </section>
  )
}
