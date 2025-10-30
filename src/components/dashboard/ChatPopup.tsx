import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  X,
  Send,
  Paperclip,
  MessageCircle,
  Clock,
  AlertCircle,
  Check,
} from "lucide-react";
import Modal from "../ui/Modal";
import { formatRelativeTime } from "@/utils/helper";
import { APP_CONFIG } from "@/lib/constants";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { socketService, Status } from "@/lib/socket";
import {
  Message,
  addMessage,
  setMessages,
  updateMessageStatus,
} from "@/lib/features/chatSlice";
import { storage } from "@/utils/helper";
import { toast } from "react-hot-toast";

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  supportName?: string;
  companyName?: string;
  companyLogo?: string;
}

const ChatPopup: React.FC<ChatPopupProps> = ({
  isOpen,
  onClose,
  supportName = "Siweh",
  companyName = "siweh",
  companyLogo = APP_CONFIG.logo,
}) => {
  const user = useAppSelector((state) => state.user.user);
  const fullName = useMemo(() => `${user?.firstName} ${user?.lastName}`, [user]);

  const [connectionStatus, setConnectionStatus] = useState<Status>("disconnected");
  const [isConnecting, setIsConnecting] = useState(false);
  const ADMIN_ID = "68e8ff9582494fc2027a5b62";
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state: any) => state.chat?.messages || []);
  const [inputValue, setInputValue] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // derive token once (use as effect dependency)
  const token = String(storage.get("accessToken") || "");

  // Create ref for messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Debug: log messages from store when they update
  useEffect(() => {
    try {
      console.log("ChatPopup - messages from store:", messages);
    } catch (e) {
      console.log("ChatPopup - messages logging error", e);
    }
  }, [messages]);

  // normalize helper
  const normalize = (m: any): Message => {
    const id = m._id ?? m.id ?? Date.now().toString();
    const senderId = m.senderId ?? m.sender ?? "";
    const receiverId = m.receiverId ?? m.receiver ?? "";
    const text = m.message ?? m.text ?? "";
    const ts = m.createdAt ?? m.timestamp ?? new Date().toISOString();
    const tempId = m.tempId ?? undefined;
    const isAdmin = senderId === ADMIN_ID;
    const status = m.status ?? (isAdmin ? "received" : "sent");
    return {
      id,
      senderId,
      receiverId,
      message: text,
      timestamp: ts,
      status,
      tempId,
      isAdmin,
    } as Message;
  };

  // Connect socket when token (or user id) changes. Register handlers before connect so we don't miss events.
  useEffect(() => {
    if (!token) return;

    setIsConnecting(true);
    setHasError(false);

    try {
      socketService.init(token);
      socketService.addStatusListener(setConnectionStatus);

      const onConnect = () => {
        console.log("Socket connected, requesting chat history", { userId: user?._id, adminId: ADMIN_ID });
        socketService.emit("get_chat_history", { userId: user?._id, adminId: ADMIN_ID });
      };

      const onChatHistory = (data: any) => {
        // server may send array directly or an object with history
        const arr = Array.isArray(data) ? data : data?.history ?? data?.messages ?? [];
        if (arr && arr.length) {
          const normalized = arr.map(normalize);
          console.log("ChatPopup - normalized chat_history:", normalized);
          dispatch(setMessages(normalized));
          setTimeout(scrollToBottom, 100);
        }
      };

      const onReceiveMessage = (message: any) => {
        const normalized = normalize(message);
        console.log("ChatPopup - normalized receive_message:", normalized);
        dispatch(addMessage(normalized));
        if (audioRef.current && !isOpen) audioRef.current.play();
        setTimeout(scrollToBottom, 100);
      };

      const onMessageSent = (message: any) => {
        const normalized = normalize(message);
        console.log("ChatPopup - normalized message_sent:", normalized);
        if ((message as any).tempId) {
          dispatch(updateMessageStatus({ tempId: (message as any).tempId, status: "sent", serverMessage: normalized }));
        } else {
          dispatch(addMessage(normalized));
        }
        setTimeout(scrollToBottom, 100);
      };

      const onMessageError = (error: { code?: string; message?: string }) => {
        console.error("Message error:", error);
        toast.error(error?.message || "Failed to send message");
      };

      socketService.on("connect", onConnect);
      socketService.on("chat_history", onChatHistory);
      socketService.on("receive_message", onReceiveMessage);
      socketService.on("message_sent", onMessageSent);
      socketService.on("message_error", onMessageError);

      // connect after listeners registered
      socketService.connect();

      // if already connected, call onConnect immediately
      try {
        if (socketService.getStatus && socketService.getStatus() === "connected") {
          onConnect();
        }
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error("Socket init error", err);
      setHasError(true);
    } finally {
      setIsConnecting(false);
    }

    return () => {
      socketService.off("connect");
      socketService.off("chat_history");
      socketService.off("receive_message");
      socketService.off("message_sent");
      socketService.off("message_error");
      socketService.removeStatusListener(setConnectionStatus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?._id, isOpen]);

  const sendMessage = () => {
    if (!inputValue.trim() || !user?._id) return;

    const tempId = Date.now().toString();
    const tempMessage: Message = {
      id: Date.now().toString(),
      senderId: user._id,
      receiverId: ADMIN_ID,
      message: inputValue.trim(),
      timestamp: new Date().toISOString(),
      status: "sending",
      tempId,
      isAdmin: false,
    };

    // Add message to redux immediately
    dispatch(addMessage(tempMessage));

    // Send to server
    socketService.emit("send_message", {
      senderId: user._id,
      receiverId: ADMIN_ID,
      message: inputValue.trim(),
      tempId,
    });

    setInputValue("");

    // Set error status if no response in 10 seconds
    setTimeout(() => {
      const currentMessage = messages.find((m: any) => m.tempId === tempId);
      if (currentMessage?.status === "sending") {
        dispatch(updateMessageStatus({ tempId, status: "error" }));
        toast.error("Message failed to send");
      }
    }, 10000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resendMessage = (msg: Message) => {
    if (!msg.tempId || !user?._id) return;
    const tId = msg.tempId;
    // mark as sending
    dispatch(updateMessageStatus({ tempId: tId, status: "sending" }));
    socketService.emit("send_message", {
      senderId: user._id,
      receiverId: ADMIN_ID,
      message: msg.message,
      tempId: tId,
    });

    // set error if no confirmation
    setTimeout(() => {
      const currentMessage = messages.find((m: any) => m.tempId === tId);
      if (currentMessage?.status === "sending") {
        dispatch(updateMessageStatus({ tempId: tId, status: "error" }));
        toast.error("Retry failed");
      }
    }, 10000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      position="bottom-right"
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={false}
      className="max-w-[400px] h-[600px] max-h-full flex flex-col relative shadow-[0px_4px_19.4px_1px_#22B5731A]"
  >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 shadow-[2px_2px_0_1px_black] rounded-lg flex items-center justify-center">
            {companyLogo ? (
              <Image
                src={companyLogo}
                alt={companyName}
                width={24}
                height={24}
              />
            ) : (
              <MessageCircle className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : connectionStatus === 'connecting' ? 'bg-yellow-400' : 'bg-gray-300'}`}
                title={`Socket: ${connectionStatus}`}
              />
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="cursor-pointer p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
        >
          <X className="w-5 h-5 text-red-500" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 h-[420px] overflow-y-auto hidden-scrollbar p-4 space-y-4 bg-white"
      >
        {messages.map((message: Message) => (
          <div key={String(message.id)} className="space-y-1">
            <div
              className={`max-w-[280px] p-3 rounded-lg text-gray-900 ${
                !message.isAdmin
                  ? "bg-[var(--primary)]/40 ml-auto"
                  : "bg-gray-100"
              }`}
            >
              <div className="flex items-end gap-2">
                <p className="text-sm whitespace-pre-line">{message.message}</p>
                {!message.isAdmin && (
                  <div className="flex-shrink-0">
                    {message.status === "sending" && (
                      <Clock className="w-3 h-3 text-gray-400" />
                    )}
                    {message.status === "error" && (
                      <button
                        onClick={() => resendMessage(message)}
                        title="Retry"
                        className="p-0 m-0"
                      >
                        <AlertCircle className="w-3 h-3 text-red-500" />
                      </button>
                    )}
                    {message.status === "sent" && (
                      <Check className="w-3 h-3 text-green-500" />
                    )}
                  </div>
                )}
              </div>
            </div>
            {message.isAdmin ? (
              <div className="flex items-start gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">{supportName}</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-400">
                    {formatRelativeTime(message.timestamp.toString())}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-end gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">You</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-400">
                    {formatRelativeTime(message.timestamp.toString())}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
        {/* Sound notification element */}
        <audio
          ref={audioRef}
          src="/sounds/chat-notification.mp3"
          preload="auto"
        />
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex items-end gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a Question"
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              rows={1}
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChatPopup;
