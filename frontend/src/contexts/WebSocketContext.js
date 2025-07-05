"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import toast from "react-hot-toast"

const WebSocketContext = createContext()

export function useWebSocket() {
  return useContext(WebSocketContext)
}

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const wsUrl = process.env.REACT_APP_WS_URL || "ws://localhost:8000"
      const ws = new WebSocket(`${wsUrl}/ws/issues/`)

      ws.onopen = () => {
        setIsConnected(true)
        console.log("WebSocket connected")
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === "issue_update") {
          const { action, issue } = data.data

          if (action === "created") {
            toast.success(`New issue created: ${issue.title}`)
          } else if (action === "updated") {
            toast.info(`Issue updated: ${issue.title}`)
          }

          // Trigger a refetch of issues data
          window.dispatchEvent(new CustomEvent("issueUpdate", { detail: data.data }))
        }
      }

      ws.onclose = () => {
        setIsConnected(false)
        console.log("WebSocket disconnected")
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
      }

      setSocket(ws)

      return () => {
        ws.close()
      }
    }
  }, [user])

  const value = {
    socket,
    isConnected,
  }

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}
