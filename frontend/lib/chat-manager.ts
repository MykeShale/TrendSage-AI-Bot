interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Chat {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messageCount: number
}

export class ChatManager {
  private static CHATS_KEY = "chats"

  static saveChat(chatId: string, messages: ChatMessage[]): void {
    if (!chatId || messages.length === 0) return

    // Save messages with proper serialization
    const messagesToSave = messages.map((msg) => ({
      ...msg,
      timestamp: msg.timestamp.toISOString(),
    }))
    localStorage.setItem(`chat-${chatId}`, JSON.stringify(messagesToSave))

    // Update chat metadata
    const chats = this.getAllChats()
    const existingChatIndex = chats.findIndex((chat) => chat.id === chatId)

    const firstUserMessage = messages.find((m) => m.role === "user")
    const title = firstUserMessage
      ? firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? "..." : "")
      : "New Chat"

    const lastMessage = messages[messages.length - 1]?.content.slice(0, 100) || ""

    const chatData: Chat = {
      id: chatId,
      title,
      lastMessage,
      timestamp: new Date(),
      messageCount: messages.length,
    }

    if (existingChatIndex >= 0) {
      chats[existingChatIndex] = chatData
    } else {
      chats.unshift(chatData)
    }

    // Serialize dates properly
    const chatsToSave = chats.map((chat) => ({
      ...chat,
      timestamp: chat.timestamp.toISOString(),
    }))
    localStorage.setItem(this.CHATS_KEY, JSON.stringify(chatsToSave))
  }

  static getAllChats(): Chat[] {
    try {
      const chats = localStorage.getItem(this.CHATS_KEY)
      if (!chats) return []

      const parsedChats = JSON.parse(chats)
      return parsedChats.map((chat: any) => ({
        ...chat,
        timestamp: new Date(chat.timestamp),
      }))
    } catch (error) {
      console.error("Error loading chats:", error)
      return []
    }
  }

  static getChatMessages(chatId: string): ChatMessage[] {
    try {
      const messages = localStorage.getItem(`chat-${chatId}`)
      if (!messages) return []

      const parsedMessages = JSON.parse(messages)
      return parsedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }))
    } catch (error) {
      console.error("Error loading chat messages:", error)
      return []
    }
  }

  static deleteChat(chatId: string): void {
    try {
      // Remove messages
      localStorage.removeItem(`chat-${chatId}`)

      // Remove from chat list
      const chats = this.getAllChats()
      const filteredChats = chats.filter((chat) => chat.id !== chatId)

      const chatsToSave = filteredChats.map((chat) => ({
        ...chat,
        timestamp: chat.timestamp.toISOString(),
      }))
      localStorage.setItem(this.CHATS_KEY, JSON.stringify(chatsToSave))
    } catch (error) {
      console.error("Error deleting chat:", error)
    }
  }

  static clearAllChats(): void {
    try {
      const chats = this.getAllChats()

      // Remove all chat messages
      chats.forEach((chat) => {
        localStorage.removeItem(`chat-${chat.id}`)
      })

      // Clear chat list
      localStorage.removeItem(this.CHATS_KEY)
    } catch (error) {
      console.error("Error clearing chats:", error)
    }
  }

  static generateChatId(): string {
    return `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
