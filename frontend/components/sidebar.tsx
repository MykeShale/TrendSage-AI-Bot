"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  MessageSquare,
  Settings,
  User,
  Moon,
  Sun,
  Trash2,
  Edit3,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Chat {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messageCount: number
}

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  currentChatId?: string
  onChatSelect: (chatId: string) => void
  onNewChat: () => void
  currentMessages?: ChatMessage[] // Add this to receive current messages
}

// Add this interface for messages
interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function Sidebar({
  isCollapsed,
  onToggle,
  currentChatId,
  onChatSelect,
  onNewChat,
  currentMessages = [],
}: SidebarProps) {
  const { theme, setTheme } = useTheme()
  const [chats, setChats] = useState<Chat[]>([])

  const formatTime = (date: Date | string) => {
    // Ensure we have a proper Date object
    const dateObj = typeof date === "string" ? new Date(date) : date

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "Unknown"
    }

    const now = new Date()
    const diff = now.getTime() - dateObj.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  // Update the useEffect that loads chats
  useEffect(() => {
    // Load chats from localStorage
    const savedChats = localStorage.getItem("chats")
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats)
        // Ensure timestamps are proper Date objects
        const chatsWithDates = parsedChats.map((chat: any) => ({
          ...chat,
          timestamp: new Date(chat.timestamp),
        }))
        setChats(chatsWithDates)
      } catch (error) {
        console.error("Error parsing saved chats:", error)
        setChats([])
      }
    } else {
      // Default chats for demo
      const defaultChats: Chat[] = [
        {
          id: "1",
          title: "Getting Started with AI",
          lastMessage: "How can I help you today?",
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          messageCount: 10,
        },
        {
          id: "2",
          title: "Code Review Assistant",
          lastMessage: "Let me review your code...",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          messageCount: 5,
        },
        {
          id: "3",
          title: "Creative Writing Help",
          lastMessage: "I can help with creative writing...",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          messageCount: 12,
        },
      ]
      setChats(defaultChats)
      localStorage.setItem("chats", JSON.stringify(defaultChats))
    }
  }, [])

  const clearAllChats = () => {
    setChats([])
    localStorage.removeItem("chats")
  }

  const saveCurrentChat = (messages: ChatMessage[]) => {
    if (!currentChatId || messages.length === 0) return

    const existingChats = JSON.parse(localStorage.getItem("chats") || "[]")
    const chatIndex = existingChats.findIndex((chat: Chat) => chat.id === currentChatId)

    // Get the first user message as title, or use a default
    const firstUserMessage = messages.find((m) => m.role === "user")
    const title = firstUserMessage
      ? firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? "..." : "")
      : "New Chat"

    const lastMessage = messages[messages.length - 1]?.content.slice(0, 100) || ""

    const chatData: Chat = {
      id: currentChatId,
      title,
      lastMessage,
      timestamp: new Date(),
      messageCount: messages.length,
    }

    if (chatIndex >= 0) {
      existingChats[chatIndex] = chatData
    } else {
      existingChats.unshift(chatData)
    }

    setChats(existingChats)
    localStorage.setItem("chats", JSON.stringify(existingChats))

    // Save the actual messages
    localStorage.setItem(`chat-${currentChatId}`, JSON.stringify(messages))
  }

  const handleNewChat = () => {
    // Save current chat if it has messages
    if (currentChatId && currentMessages.length > 0) {
      saveCurrentChat(currentMessages)
    }

    // Create new chat
    onNewChat()
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 60 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-col h-full bg-background border-r border-border/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TrendSage AI
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 hover:bg-accent/50">
          {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={handleNewChat}
          className={cn(
            "w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200",
            isCollapsed && "px-0",
          )}
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">New Chat</span>}
        </Button>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 px-2 custom-scrollbar">
        <div className="space-y-1">
          <AnimatePresence>
            {chats.map((chat) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => onChatSelect(chat.id)}
                  className={cn(
                    "w-full justify-start h-auto p-3 hover:bg-accent/50 transition-colors group",
                    currentChatId === chat.id && "bg-accent/70",
                    isCollapsed && "px-2",
                  )}
                >
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="ml-3 flex-1 text-left overflow-hidden">
                      <div className="font-medium text-sm truncate">{chat.title}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {chat.messageCount} messages • {formatTime(chat.timestamp)}
                      </div>
                    </div>
                  )}
                  {!isCollapsed && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle edit
                        }}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <Separator className="opacity-50" />

      {/* Bottom Section */}
      <div className="p-4 space-y-2">
        {!isCollapsed && (
          <Button
            variant="ghost"
            onClick={clearAllChats}
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            <span className="ml-2">Clear conversations</span>
          </Button>
        )}

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center space-x-2 hover:bg-accent/50",
                  isCollapsed ? "w-8 h-8 p-0" : "w-full justify-start",
                )}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                    U
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">User</div>
                    <div className="text-xs text-muted-foreground">Free Plan</div>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                Toggle theme
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  )
}
