"use client"

import { motion } from "framer-motion"

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 p-4">
      <div className="flex space-x-1">
        <motion.div
          className="w-2 h-2 bg-muted-foreground/60 rounded-full typing-dot"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
        />
        <motion.div
          className="w-2 h-2 bg-muted-foreground/60 rounded-full typing-dot"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
        />
        <motion.div
          className="w-2 h-2 bg-muted-foreground/60 rounded-full typing-dot"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
        />
      </div>
      <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
    </div>
  )
}
