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
import { Socket } from "socket.io-client";
import { socketService } from "@/lib/socket";
import {
  Message,
  addMessage,
  setMessages,
  updateMessageStatus,
} from "@/lib/features/chatSlice";
import { storage } from "@/utils/helper";
import { toast } from "react-hot-toast";

// Using Message interface from chatSlice

interface ChatPopupNewProps {
  isOpen: boolean;
  onClose: () => void;
  supportName?: string;
  companyName?: string;
  companyLogo?: string;
}

const ChatPopupNew: React.FC<ChatPopupNewProps> = ({
  isOpen,
  onClose,
  supportName = "Siweh",
  companyName = "siweh",
  companyLogo = APP_CONFIG.logo,
}) => {
  const ADMIN_ID = "68e8ff9582494fc2027a5b62";
  const [socket, setSocket] = useState<Socket | null>(null);
  const user = useAppSelector((state) => state.user.user);
  const token = String(storage.get("accessToken"));

  useEffect(() => {
    if (!token) return;

    // use singleton socketService
    socketService.init(token);
    socketService.connect();

    socketService.on("connect", () => {
      console.log("✅ Socket connected successfully");
    });

    console.log("Requesting chat list...", { userId: user?._id, adminId: ADMIN_ID });
    socketService.emit("get_chat_history", { userId: user?._id, adminId: ADMIN_ID });

    socketService.on("chat_history", (history: any) => {
      console.log("chat_history received:", history);
    });

    socketService.on("errorResponse", (err: any) => console.error("❌ Socket error:", err));
    socketService.on("connect_error", (err: any) => console.error("⚠️ Connection error:", err.message));

    return () => {
      socketService.off("messageReceived");
      socketService.off("errorResponse");
      socketService.off("connect_error");
    };
  }, [token]);

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
      Hello
      <button
        onClick={onClose}
        className="cursor-pointer p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
      >
        <X className="w-5 h-5 text-red-500" />
      </button>
    </Modal>
  );
};

export default ChatPopupNew;
