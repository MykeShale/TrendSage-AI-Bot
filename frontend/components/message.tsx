"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Edit3, RotateCcw, Check, User, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "next-themes"

interface MessageProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
  }
  onRegenerate?: () => void
  onEdit?: () => void
}

export function Message({ message, onRegenerate, onEdit }: MessageProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const { theme } = useTheme()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      toast({
        description: "Message copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        description: "Failed to copy message",
        variant: "destructive",
      })
    }
  }

  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group flex gap-4 p-6 hover:bg-accent/30 transition-colors ${isUser ? "bg-accent/20" : ""}`}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        {isUser ? (
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <User className="h-4 w-4" />
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">{isUser ? "You" : "TrendSage AI"}</span>
          <span className="text-xs text-muted-foreground">{message.timestamp.toLocaleTimeString()}</span>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "")
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={theme === "dark" ? oneDark : oneLight}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 px-2">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>

          {isUser && onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 px-2">
              <Edit3 className="h-3 w-3" />
            </Button>
          )}

          {!isUser && onRegenerate && (
            <Button variant="ghost" size="sm" onClick={onRegenerate} className="h-8 px-2">
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
