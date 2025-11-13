// pages/MessagingPage.jsx - COMPLETE VERSION
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import io from "socket.io-client";
import { X, Search } from "lucide-react";

// ✅ Choose the correct backend URL based on environment
const SOCKET_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://linkedin-backend-k3cs.onrender.com";

// ✅ Initialize socket connection once
const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

const MessagingPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Get current user
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // ✅ FIX: Get all conversations with proper data handling
  const { data: conversations, refetch: refetchConversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await axiosInstance.get("/messages/conversations/all");
      // Handle different response formats
      if (Array.isArray(res.data)) return res.data;
      if (res.data?.conversations) return res.data.conversations;
      if (res.data?.data) return res.data.data;
      return [];
    },
  });

  // ✅ FIX: Get connections with proper data handling
  const { data: connections } = useQuery({
    queryKey: ["connections"],
    queryFn: async () => {
      const res = await axiosInstance.get("/connections");
      // Handle different response formats
      if (Array.isArray(res.data)) return res.data;
      if (res.data?.connections) return res.data.connections;
      if (res.data?.data) return res.data.data;
      return [];
    },
  });

  // Socket.io setup
  useEffect(() => {
    if (!authUser) return;

    socket.emit("user-online", authUser._id);

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
      refetchConversations();
    });

    socket.on("user-typing", ({ senderId }) => {
      if (selectedUser && senderId === selectedUser._id) {
        setIsTyping(true);
      }
    });

    socket.on("user-stop-typing", ({ senderId }) => {
      if (selectedUser && senderId === selectedUser._id) {
        setIsTyping(false);
      }
    });

    socket.on("messages-read", ({ readBy }) => {
      if (selectedUser && readBy === selectedUser._id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === authUser._id ? { ...msg, read: true } : msg
          )
        );
      }
    });

    return () => {
      socket.off("receive-message");
      socket.off("user-typing");
      socket.off("user-stop-typing");
      socket.off("messages-read");
    };
  }, [authUser, selectedUser]);

  // Load messages when user is selected
  useEffect(() => {
    if (selectedUser && authUser) {
      loadMessages();
      socket.emit("join-chat", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
      });
      socket.emit("mark-read", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
      });
    }
  }, [selectedUser]);

  const loadMessages = async () => {
    try {
      const res = await axiosInstance.get(`/messages/${selectedUser._id}`);
      // Ensure messages is always an array
      setMessages(Array.isArray(res.data) ? res.data : []);
      scrollToBottom();
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await axiosInstance.post("/messages/send", {
        receiverId: selectedUser._id,
        message: newMessage,
      });

      socket.emit("send-message", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
        message: newMessage,
      });

      setNewMessage("");
      handleStopTyping();
      refetchConversations();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!selectedUser) return;

    socket.emit("typing", {
      senderId: authUser._id,
      receiverId: selectedUser._id,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 2000);
  };

  const handleStopTyping = () => {
    if (!selectedUser) return;
    socket.emit("stop-typing", {
      senderId: authUser._id,
      receiverId: selectedUser._id,
    });
  };

  const handleStartNewChat = (user) => {
    setSelectedUser(user);
    setShowNewChatModal(false);
    setSearchQuery("");
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ FIX: Filter connections with Array safety check
  const filteredConnections = Array.isArray(connections)
    ? connections.filter((conn) =>
        conn.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="flex h-screen bg-gray-100 overflow-y-hidden">
      {/* Conversations List */}
      <div className="w-1/4 bg-white border-r flex-shrink-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Messages</h2>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700"
            >
              + New
            </button>
          </div>
        </div>
        <div>
          {!conversations || conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No conversations yet</p>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="text-blue-600 mt-2 hover:underline"
              >
                Start a new chat
              </button>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.user._id}
                onClick={() => setSelectedUser(conv.user)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedUser?._id === conv.user._id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={conv.user.profilePicture || "/avatar.png"}
                    alt={conv.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{conv.user.name}</p>
                    <p className="text-sm text-gray-600 truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center flex-shrink-0">
              <img
                src={selectedUser.profilePicture || "/avatar.png"}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="font-semibold">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.headline}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isSent =
                    msg.senderId === authUser._id ||
                    msg.senderId._id === authUser._id;
                  return (
                    <div
                      key={msg._id || index}
                      className={`flex mb-4 ${
                        isSent ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isSent
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-800"
                        }`}
                      >
                        <p>{msg.message}</p>
                        <div className="flex items-center justify-end mt-1 gap-1">
                          <span
                            className={`text-xs ${
                              isSent ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {formatTime(msg.createdAt || msg.timestamp)}
                          </span>
                          {isSent && (
                            <span className="text-xs text-blue-100">
                              {msg.read ? "✓✓" : "✓"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white px-4 py-2 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t px-6 py-4 flex-shrink-0">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-3"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleTyping}
                  onBlur={handleStopTyping}
                  placeholder="Write a message..."
                  className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-4">Select a conversation to start messaging</p>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">New Message</h3>
              <button
                onClick={() => {
                  setShowNewChatModal(false);
                  setSearchQuery("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 border-b">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search connections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConnections.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchQuery
                    ? "No connections found"
                    : "No connections yet. Connect with people to start chatting!"}
                </div>
              ) : (
                filteredConnections.map((connection) => (
                  <div
                    key={connection._id}
                    onClick={() => handleStartNewChat(connection)}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={connection.profilePicture || "/avatar.png"}
                        alt={connection.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{connection.name}</p>
                        <p className="text-sm text-gray-600">
                          {connection.headline}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingPage;
