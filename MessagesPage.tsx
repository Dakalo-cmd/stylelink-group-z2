import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Send, Search, User } from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { user, accessToken } = useAuth();

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ea7dcd64/messages`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!accessToken || !newMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ea7dcd64/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            recipientId: selectedConversation,
            content: newMessage,
          }),
        }
      );

      if (response.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getConversations = () => {
    if (!user) return [];

    const conversations = new Map<string, Message[]>();

    messages.forEach((msg) => {
      const otherUserId = msg.senderId === user.id ? msg.recipientId : msg.senderId;

      if (!conversations.has(otherUserId)) {
        conversations.set(otherUserId, []);
      }
      conversations.get(otherUserId)?.push(msg);
    });

    return Array.from(conversations.entries()).map(([userId, msgs]) => ({
      userId,
      messages: msgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
      lastMessage: msgs[msgs.length - 1],
      unreadCount: msgs.filter((m) => !m.read && m.recipientId === user.id).length,
    }));
  };

  const getConversationMessages = () => {
    if (!selectedConversation || !user) return [];

    return messages
      .filter(
        (msg) =>
          (msg.senderId === user.id && msg.recipientId === selectedConversation) ||
          (msg.recipientId === user.id && msg.senderId === selectedConversation)
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const conversations = getConversations();
  const conversationMessages = getConversationMessages();

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-full md:w-80 border-r border-[#d4af37]/20 flex flex-col bg-[#0a0a0a]">
          <div className="p-4 border-b border-[#d4af37]/20">
            <h2 className="text-2xl font-bold text-[#fafafa] mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8a8a8]" size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#d4af37]/20 rounded-lg text-[#fafafa] placeholder-[#a8a8a8] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-[#a8a8a8]">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <motion.button
                  key={conv.userId}
                  onClick={() => setSelectedConversation(conv.userId)}
                  className={`
                    w-full p-4 border-b border-[#d4af37]/10 text-left transition-all
                    ${selectedConversation === conv.userId
                      ? "bg-[#d4af37]/10"
                      : "hover:bg-[#1a1a1a]"
                    }
                  `}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#ffd700] rounded-full flex items-center justify-center">
                      <User size={20} className="text-[#0a0a0a]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-[#fafafa]">User {conv.userId.slice(0, 8)}</span>
                        {conv.unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-[#d4af37] text-[#0a0a0a] text-xs font-bold rounded-full">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#a8a8a8] truncate">
                        {conv.lastMessage.content}
                      </p>
                      <span className="text-xs text-[#a8a8a8]">
                        {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[#d4af37]/20 bg-[#0a0a0a]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-[#ffd700] rounded-full flex items-center justify-center">
                    <User size={18} className="text-[#0a0a0a]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#fafafa]">User {selectedConversation.slice(0, 8)}</h3>
                    <p className="text-xs text-[#a8a8a8]">Online</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversationMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`
                        max-w-xs md:max-w-md px-4 py-3 rounded-2xl
                        ${msg.senderId === user?.id
                          ? "bg-[#d4af37] text-[#0a0a0a] rounded-br-none"
                          : "bg-[#1a1a1a] text-[#fafafa] rounded-bl-none"
                        }
                      `}
                    >
                      <p className="break-words">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.senderId === user?.id ? "text-[#0a0a0a]/60" : "text-[#a8a8a8]"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-[#d4af37]/20 bg-[#0a0a0a]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#d4af37]/20 rounded-lg text-[#fafafa] placeholder-[#a8a8a8] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  />
                  <Button variant="primary" onClick={sendMessage}>
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={40} className="text-[#d4af37]" />
                </div>
                <h3 className="text-xl font-bold text-[#fafafa] mb-2">Your Messages</h3>
                <p className="text-[#a8a8a8]">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
