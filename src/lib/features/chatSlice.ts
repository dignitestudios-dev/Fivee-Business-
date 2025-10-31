import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string | number;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string | Date;
  status?: 'sending' | 'sent' | 'error' | 'received';
  tempId?: string; // For tracking messages before server confirmation
  isAdmin: boolean;
}

interface ChatState {
  messages: Message[];
  isLoaded: boolean;
}

const initialState: ChatState = {
  messages: [],
  isLoaded: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      console.log("Setting messages:", action.payload);
      state.messages = action.payload;
      state.isLoaded = true;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateMessageStatus: (state, action: PayloadAction<{ tempId: string; status: 'sending' | 'sent' | 'error' | 'received'; serverMessage?: Message }>) => {
      const { tempId, status, serverMessage } = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg.tempId === tempId);
      if (messageIndex !== -1) {
        if (serverMessage) {
          state.messages[messageIndex] = { ...serverMessage, status };
        } else {
          state.messages[messageIndex].status = status;
        }
      }
    },
    clearMessages: (state) => {
      state.messages = [];
      state.isLoaded = false;
    },
  },
});

export const { setMessages, addMessage, updateMessageStatus, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;