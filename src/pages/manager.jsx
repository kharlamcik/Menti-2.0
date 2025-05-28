import Button from "@/components/Button"
import GameWrapper from "@/components/game/GameWrapper"
import ManagerPassword from "@/components/ManagerPassword"
import { GAME_STATES, GAME_STATE_COMPONENTS_MANAGER } from "@/constants"
import { usePlayerContext } from "@/context/player"
import { useSocketContext } from "@/context/socket"
import { useRouter } from "next/router"
import { createElement, useEffect, useState } from "react"
import { QRCode } from "react-qrcode-logo" // Убедись, что установлен react-qrcode-logo

export default function Manager() {
  const { socket } = useSocketContext()

  const [nextText, setNextText] = useState("ЛетсГоу")
  const [state, setState] = useState({
    ...GAME_STATES,
    status: {
      ...GAME_STATES.status,
      name: "SHOW_ROOM",
    },
  })

  useEffect(() => {
    socket.on("game:status", (status) => {
      setState((prevState) => ({
        ...prevState,
        status: status,
        question: {
          ...prevState.question,
          current: status.question,
        },
      }))
    })

    socket.on("manager:inviteCode", (inviteCode) => {
      setState((prevState) => ({
        ...prevState,
        created: true,
        status: {
          ...prevState.status,
          data: {
            ...prevState.status.data,
            inviteCode: inviteCode,
          },
        },
      }))
    })

    return () => {
      socket.off("game:status")
      socket.off("manager:inviteCode")
    }
  }, [])

  const handleSkip = () => {
    setNextText("Скип")

    switch (state.status.name) {
      case "SHOW_ROOM":
        socket.emit("manager:startGame")
        break
      case "SELECT_ANSWER":
        socket.emit("manager:abortQuiz")
        break
      case "SHOW_RESPONSES":
        socket.emit("manager:showLeaderboard")
        break
      case "SHOW_LEADERBOARD":
        socket.emit("manager:nextQuestion")
        break
    }
  }

  const inviteLink = state.status?.data?.inviteCode
    ? `http://192.168.0.190:3000/`
    : ""

  return (
    <>
      {!state.created ? (
        <div>
          <ManagerPassword />
        </div>
      ) : (
        <>
          <GameWrapper textNext={nextText} onNext={handleSkip} manager>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              {inviteLink && (
                <QRCode
                  value={inviteLink}
                  size={200}
                  logoImage="/logo.png" // убери, если логотип не нужен
                  logoWidth={40}
                  qrStyle="dots"
                />
              )}
              
            </div>

            {GAME_STATE_COMPONENTS_MANAGER[state.status.name] &&
              createElement(GAME_STATE_COMPONENTS_MANAGER[state.status.name], {
                data: state.status.data,
              })}
          </GameWrapper>
        </>
      )}
    </>
  )
}
