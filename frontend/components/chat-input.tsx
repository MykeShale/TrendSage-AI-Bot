"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
  onStop?: () => void
}

export function ChatInput({ onSendMessage, isLoading, onStop }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  return (
    <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end space-x-2">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message TrendSage AI..."
                className="min-h-[60px] max-h-[200px] resize-none pr-12 pl-4 py-4 rounded-2xl border-2 border-border/50 focus:border-blue-500/50 transition-colors bg-background/50 backdrop-blur-sm"
                disabled={isLoading}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 bottom-2 h-8 w-8 hover:bg-accent/50"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="stop"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    type="button"
                    onClick={onStop}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-xl border-2 hover:bg-destructive/10 hover:border-destructive/50"
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    type="submit"
                    disabled={!message.trim()}
                    className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>

        <div className="text-xs text-muted-foreground text-center mt-2">
          Press Enter to send, Shift + Enter for new line
        </div>
      </div>
    </div>
  )
}
