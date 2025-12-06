"use client";
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
import {
  formatDateTime,
  formatRelativeTime,
  formatTo12HourTime,
} from "@/utils/helper";
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
import { useGlobalPopup } from "@/hooks/useGlobalPopup";

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
  supportName = "Fivee Business",
  companyName = "Fivee Business",
  companyLogo = APP_CONFIG.logo,
}) => {
  const { showError } = useGlobalPopup();
  const user = useAppSelector((state) => state.user.user);
  const fullName = useMemo(
    () => `${user?.firstName} ${user?.lastName}`,
    [user]
  );

  const [connectionStatus, setConnectionStatus] =
    useState<Status>("disconnected");
  const [isConnecting, setIsConnecting] = useState(false);
  const ADMIN_ID = "68e8ff9582494fc2027a5b62";
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.chats.messages || []);
  const [inputValue, setInputValue] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create ref for messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // Keep a ref to the latest messages to avoid stale closures inside socket handlers
  const messagesRef = useRef<Message[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Auto scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, onClose]);

  // Debug: log messages from store when they update
  console.log("ChatPopup - messages from store:", messages);

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
    const token = String(storage.get("accessToken") || "");

    if (!token) return;

    setIsConnecting(true);
    setHasError(false);

    try {
      socketService.init(token);
      socketService.addStatusListener(setConnectionStatus);

      const onConnect = () => {
        console.log("Socket connected, requesting chat history", {
          userId: user?._id,
          adminId: ADMIN_ID,
        });
        socketService.emit("get_chat_history", {
          userId: user?._id,
          adminId: ADMIN_ID,
        });
      };

      const onChatHistory = (data: any) => {
        // server may send array directly or an object with history
        console.log("received chat history:", data);
        const arr = Array.isArray(data)
          ? data
          : data?.history ?? data?.messages ?? [];
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

        // If this message has a server id and we already have it, ignore (prevents duplicates)
        if (
          normalized.id &&
          messagesRef.current.some(
            (m) => String(m.id) === String(normalized.id)
          )
        ) {
          // If the existing message is a temp message (has tempId) and server provided tempId, update it
          if ((message as any).tempId) {
            dispatch(
              updateMessageStatus({
                tempId: (message as any).tempId,
                status: "received",
                serverMessage: normalized,
              })
            );
          }
          return;
        }

        // If message has tempId and matches a local temp message, update that message instead of adding duplicate
        if ((message as any).tempId) {
          const existing = messagesRef.current.find(
            (m) => m.tempId === (message as any).tempId
          );
          if (existing) {
            dispatch(
              updateMessageStatus({
                tempId: (message as any).tempId,
                status: "received",
                serverMessage: normalized,
              })
            );
            return;
          }
        }

        // Otherwise add the incoming server message
        dispatch(addMessage(normalized));
        if (normalized.senderId !== user?._id && audioRef.current && !isOpen) {
          audioRef.current.play();
        }
        setTimeout(scrollToBottom, 100);
      };

      const onMessageSent = (message: any) => {
        const normalized = normalize(message);
        console.log("ChatPopup - normalized message_sent:", normalized);

        // If server returned a tempId, update the temporary message
        if ((message as any).tempId) {
          const exists = messagesRef.current.find(
            (m) => m.tempId === (message as any).tempId
          );
          if (exists) {
            dispatch(
              updateMessageStatus({
                tempId: (message as any).tempId,
                status: "sent",
                serverMessage: normalized,
              })
            );
            setTimeout(scrollToBottom, 100);
            return;
          }
        }

        // If the message has a server id and we don't have it yet, add it
        if (
          normalized.id &&
          !messagesRef.current.some(
            (m) => String(m.id) === String(normalized.id)
          )
        ) {
          dispatch(addMessage(normalized));
          setTimeout(scrollToBottom, 100);
        }
      };

      const onMessageError = (error: { code?: string; message?: string }) => {
        console.error("Message error:", error);
        showError(error?.message || "Failed to send message", "Message Error");
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
        if (
          socketService.getStatus &&
          socketService.getStatus() === "connected"
        ) {
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
  }, [user?._id, isOpen]);

  const sendMessage = () => {
    if (!inputValue.trim() || !user?._id) return;

    const clientId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const messageText = inputValue.trim();

    // Clear input before sending to allow for multiple messages
    setInputValue("");

    // Send to server
    socketService.emit("send_message", {
      senderId: user._id,
      receiverId: ADMIN_ID,
      message: messageText,
      tempId: clientId,
      timestamp: new Date().toISOString(),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resendMessage = (msg: Message) => {
    if (!msg.tempId || !user?._id) return;

    // Remove the failed message
    dispatch(updateMessageStatus({ tempId: msg.tempId, status: "error" }));

    // Generate new tempId for retry
    const newTempId = `${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Send to server with new tempId
    socketService.emit("send_message", {
      senderId: user._id,
      receiverId: ADMIN_ID,
      message: msg.message,
      tempId: newTempId,
      timestamp: new Date().toISOString(),
    });
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
          {companyLogo ? (
            <Image src={companyLogo} alt={companyName} width={60} height={60} />
          ) : (
            <div className="w-10 h-10 bg-green-600 shadow-[2px_2px_0_1px_black] rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
          )}

          <p className="text-gray-800 font-bold text-xl">Fivee Business</p>
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
                    {formatTo12HourTime(message.timestamp.toString())}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-end gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">You</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-400">
                    {formatTo12HourTime(message.timestamp.toString())}
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
