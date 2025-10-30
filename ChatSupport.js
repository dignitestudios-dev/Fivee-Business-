import { useState, useRef, useEffect, useMemo } from "react";
import { Send, Search, MessageSquare, Timer } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { formatNumber } from "../utils/helpers";
import StatsCard from "../components/common/StatsCard";
import { createSocket } from "../socket/socket";

const ChatSupport = () => {
  const token = localStorage.getItem("authToken");
  console.log("Token in ChatSupport:", token);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [chats, setChats] = useState([]); // Store chats dynamically
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Stats for chats
  const chatsStats = useMemo(
    () => [
      {
        title: "Total Chats",
        value: formatNumber(chats.length),
        icon: MessageSquare,
      },
      {
        title: "Active Chats",
        value: formatNumber(
          chats.filter((chat) => chat.status === "online").length
        ),
        icon: MessageSquare,
      },
      {
        title: "Unread Messages",
        value: formatNumber(
          chats.reduce((sum, chat) => sum + chat.unreadCount, 0)
        ),
        icon: MessageSquare,
      },
      { title: "Avg Response Time", value: "2.5 min", icon: Timer },
    ],
    [chats]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const ADMIN_ID = "68e8ff9582494fc2027a5b62"; // Your admin ID
  const USER_ID = "68d139b5c0f05bdb66aa62e8"; // Example user ID (replace with dynamic values)

  useEffect(() => {
    if (!token) return;

    const newSocket = createSocket(token);
    setSocket(newSocket);
    newSocket.connect();

    newSocket.on("connect", () => {
      console.log("✅ Socket connected successfully");
    });

    // Emit to get chat list when the socket connects
    newSocket.emit("admin_get_chats", { userId: USER_ID, adminId: ADMIN_ID });

    // Listen for the chat list data
    newSocket.on("chat_list", (history) => {
      console.log("chat_list received:", history);
      setChats(
        history.map((chat) => ({
          id: chat._id,
          userName: `${chat.user.firstName} ${chat.user.lastName}`,
          userEmail: chat.user.email,
          lastMessage: chat.lastMessage,
          lastMessageTime: chat.lastMessageAt,
          unreadCount: chat.unreadCount,
          messages: [], // Initialize empty messages array
          userId: chat.user._id,
        }))
      );
    });

    // Listen for the chat history for a selected chat
    newSocket.on("chat_history", (history) => {
      console.log("Received chat history:", history);
      setSelectedChat((prevChat) => ({
        ...prevChat,
        messages: history || [], // Assuming history.messages contains the chat history
      }));
    });

    newSocket.on("errorResponse", (err) =>
      console.error("❌ Socket error:", err)
    );
    newSocket.on("connect_error", (err) =>
      console.error("⚠️ Connection error:", err.message)
    );

    return () => {
      newSocket.disconnect();
      newSocket.off("messageReceived");
      newSocket.off("errorResponse");
      newSocket.off("connect_error");
    };
  }, [token]);

  // Scroll to the bottom of the chat messages when they change
  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  // Handle message send action
  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      chatId: selectedChat.id,
      senderId: "admin",
      senderName: "Admin",
      message: message.trim(),
      timestamp: new Date().toISOString(),
      isAdmin: true,
    };

    // Emit the message to the server
    socket.emit("send_message", newMessage);

    // Update the selected chat locally (for immediate UI update)
    setSelectedChat((prevChat) => ({
      ...prevChat,
      messages: [...prevChat.messages, newMessage],
      lastMessage: newMessage.message,
      lastMessageTime: new Date().toISOString(),
    }));

    setMessage(""); // Clear input field
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Filter chats based on search term
  const filteredChats = chats.filter(
    (chat) =>
      chat.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  // Handle chat selection
  const handleSelectChat = (chat) => {
    // Emit event to fetch chat history when a chat is selected
    console.log("Selecting chat:", chat);

    socket.emit("get_chat_history", { userId: chat.userId, adminId: ADMIN_ID });
    // Set the selected chat
    setSelectedChat(chat);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {chatsStats?.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon ? <stat.icon /> : null}
            colored
            color={stat.color}
            bgColor={stat.bgColor}
            index={index}
          />
        ))}
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Chat List */}
        <Card className="lg:col-span-1">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Chat Support
            </h3>
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>

          <div className="overflow-y-auto h-[500px]">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  selectedChat?.id === chat.id
                    ? "bg-gray-500 dark:bg-[#6bc29b]"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {chat.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {chat.userName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(chat.lastMessageTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {chat.lastMessage}
                      </p>
                      {chat.unreadCount > 0 && (
                        <Badge variant="danger" className="text-xs">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Chat Messages */}
        <Card className="lg:col-span-2">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {selectedChat.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedChat.userName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {selectedChat.userEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px]">
                {selectedChat.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.senderId === ADMIN_ID || msg.receiverId === ADMIN_ID
                        ? "justify-end"
                        : "justify-start"
                    }`} // Align if either sender or receiver is the admin
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.senderId === ADMIN_ID || msg.receiverId === ADMIN_ID
                          ? "bg-primary-600 text-white" // Admin's message (right-aligned)
                          : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white" // User's message (left-aligned)
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.senderId === ADMIN_ID ||
                          msg.receiverId === ADMIN_ID
                            ? "text-primary-100"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(msg.updatedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      rows={1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    icon={<Send className="w-4 h-4" />}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500">
                  Choose a chat from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ChatSupport;
