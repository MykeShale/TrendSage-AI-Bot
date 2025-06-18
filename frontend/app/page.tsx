"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatInterface } from "@/components/chat-interface"
import { motion } from "framer-motion"

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string>()
  const [currentMessages, setCurrentMessages] = useState<any[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Listen for chat updates
    const handleChatUpdate = (event: any) => {
      setCurrentMessages(event.detail.messages)
      if (!currentChatId) {
        setCurrentChatId(event.detail.chatId)
      }
    }

    window.addEventListener("chatUpdated", handleChatUpdate)

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("chatUpdated", handleChatUpdate)
    }
  }, [currentChatId])

  const handleNewChat = () => {
    // Clear current chat state to start fresh
    setCurrentChatId(undefined)
    setCurrentMessages([])
  }

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId)

    // Load messages for selected chat using ChatManager
    try {
      const savedMessages = localStorage.getItem(`chat-${chatId}`)
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages)
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setCurrentMessages(messagesWithDates)
      } else {
        setCurrentMessages([])
      }
    } catch (error) {
      console.error("Error loading chat:", error)
      setCurrentMessages([])
    }

    if (isMobile) {
      setSidebarCollapsed(true)
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentChatId={currentChatId}
        currentMessages={currentMessages}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
      />

      {/* Main Content */}
      <motion.div
        className="flex-1 flex flex-col min-w-0"
        initial={false}
        animate={{
          marginLeft: isMobile && !sidebarCollapsed ? 0 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <ChatInterface key={currentChatId || "new"} chatId={currentChatId} />
      </motion.div>

      {/* Mobile overlay */}
      {isMobile && !sidebarCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  )
}
