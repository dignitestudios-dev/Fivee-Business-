import React, { useEffect, useState, useRef, ReactNode, useMemo } from "react";
import { X, Send, Paperclip, MessageCircle } from "lucide-react";
import Modal from "../ui/Modal";
import { formatRelativeTime } from "@/utils/helper";
import { APP_CONFIG } from "@/lib/constants";
import Image from "next/image";
import { useAppSelector } from "@/lib/hooks";

interface Message {
  id: number;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
}

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
  const fullName = useMemo(
    () => `${user?.firstName} ${user?.lastName}`,
    [user]
  );
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hi there. This is the support chat for ${companyName}.\nHow can we help?`,
      sender: "support",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("");

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

  // Auto scroll when chat popup opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the modal is fully rendered
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isOpen]);

  const sendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputValue.trim(),
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");

      // Simulate support response
      setTimeout(() => {
        const response: Message = {
          id: Date.now() + 1,
          text: "Thanks for your message! Our team will get back to you shortly.",
          sender: "support",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, response]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
        {messages.map((message) => (
          <div key={message.id} className="space-y-1">
            <div
              className={`max-w-[280px] p-3 rounded-lg text-gray-900 ${
                message.sender === "user"
                  ? "bg-[var(--primary)]/40 ml-auto"
                  : "bg-gray-100"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.text}</p>
            </div>
            {message.sender === "support" ? (
              <div className="flex items-start gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">{supportName}</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-400">
                    {formatRelativeTime(new Date().toString())}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-end gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">You</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-400">
                    {formatRelativeTime(new Date().toString())}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
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
