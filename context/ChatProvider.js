"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState({});

  // Load chats from local storage on mount
  useEffect(() => {
    const storedChats = localStorage.getItem("chatSessions");
    if (storedChats) {
      setChats(JSON.parse(storedChats));
    }
  }, []);

  // Save chats to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(chats));
  }, [chats]);

  const createNewChat = (sender, receiver) => {
    const chatId = uuidv4();

    setChats((prev) => ({
      ...prev,
      [chatId]: { sender, receiver },
    }));

    return chatId;
  };

  const getChatParticipants = (chatId) => {
    return chats[chatId] || null;
  };

  return (
    <ChatContext.Provider value={{ createNewChat, getChatParticipants, chats }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
