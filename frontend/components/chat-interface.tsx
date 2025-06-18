"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Message } from "./message"
import { ChatInput } from "./chat-input"
import { TypingIndicator } from "./typing-indicator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  chatId?: string
}

export function ChatInterface({ chatId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(chatId)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Generate new chat ID when starting fresh
  useEffect(() => {
    if (!chatId && messages.length === 0) {
      // Don't generate ID until first message
      setCurrentChatId(undefined)
    } else if (chatId) {
      setCurrentChatId(chatId)
    }
  }, [chatId])

  // Load messages for current chat
  useEffect(() => {
    if (chatId) {
      try {
        const savedMessages = localStorage.getItem(`chat-${chatId}`)
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages)
          // Convert timestamp strings back to Date objects
          const messagesWithDates = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
          setMessages(messagesWithDates)
        } else {
          setMessages([])
        }
      } catch (error) {
        console.error("Error loading messages:", error)
        setMessages([])
      }
    } else {
      setMessages([])
    }
  }, [chatId])

  // Save messages when they change
  useEffect(() => {
    if (chatId && messages.length > 0) {
      try {
        const messagesToSave = messages.map((msg) => ({
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        }))
        localStorage.setItem(`chat-${chatId}`, JSON.stringify(messagesToSave))
      } catch (error) {
        console.error("Error saving messages:", error)
      }
    }
  }, [messages, chatId])

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle scroll to show/hide scroll button
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    setShowScrollButton(!isNearBottom)
  }

  const handleSendMessage = async (content: string) => {
    // Generate chat ID on first message if we don't have one
    let activeChatId = currentChatId
    if (!activeChatId) {
      activeChatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      setCurrentChatId(activeChatId)
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: "user",
      content,
      timestamp: new Date(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsLoading(true)

    // Save immediately after user message
    localStorage.setItem(`chat-${activeChatId}`, JSON.stringify(newMessages))

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}-${Math.random().toString(36).substr(2, 9)}`,
        role: "assistant",
        content: `Thank you for your message: "${content}". This is a demo response from TrendSage AI. In a real implementation, this would connect to an actual AI service.

Here's some **markdown** formatting:

- Bullet point 1
- Bullet point 2  
- Bullet point 3

\`\`\`javascript
// Code example
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

How else can I help you today?`,
        timestamp: new Date(),
      }

      const finalMessages = [...newMessages, aiMessage]
      setMessages(finalMessages)
      setIsLoading(false)

      // Save after AI response
      localStorage.setItem(`chat-${activeChatId}`, JSON.stringify(finalMessages))

      // Update chat in sidebar
      window.dispatchEvent(
        new CustomEvent("chatUpdated", {
          detail: { chatId: activeChatId, messages: finalMessages },
        }),
      )
    }, 2000)
  }

  const handleRegenerate = () => {
    // Remove last AI message and regenerate
    setMessages((prev) => {
      const lastUserMessageIndex = prev.findLastIndex((m) => m.role === "user")
      if (lastUserMessageIndex !== -1) {
        const userMessage = prev[lastUserMessageIndex]
        const newMessages = prev.slice(0, lastUserMessageIndex + 1)
        setTimeout(() => handleSendMessage(userMessage.content), 100)
        return newMessages
      }
      return prev
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 relative">
        <ScrollArea className="h-full custom-scrollbar" onScrollCapture={handleScroll} ref={scrollAreaRef}>
          <div className="max-w-4xl mx-auto">
            <AnimatePresence>
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-8"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome to TrendSage AI
                  </h2>
                  <p className="text-muted-foreground max-w-md">
                    Start a conversation with our AI assistant. Ask questions, get help with coding, writing, or
                    anything else you need.
                  </p>
                </motion.div>
              ) : (
                messages.map((message) => (
                  <Message
                    key={message.id}
                    message={message}
                    onRegenerate={message.role === "assistant" ? handleRegenerate : undefined}
                  />
                ))
              )}
            </AnimatePresence>

            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Scroll to bottom button */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 right-4"
            >
              <Button
                onClick={scrollToBottom}
                size="icon"
                className="rounded-full shadow-lg bg-background border border-border hover:bg-accent"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} onStop={() => setIsLoading(false)} />
    </div>
  )
}
