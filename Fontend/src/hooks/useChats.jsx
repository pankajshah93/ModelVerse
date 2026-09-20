import { useCallback, useEffect, useState } from "react";

import * as chatsApi from "../api/chats";
import * as messagesApi from "../api/messages";

export function useChats(token) {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);

  const [loadingChats, setLoadingChats] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // LOAD CHATS
  // =========================
  const loadChats = useCallback(async () => {
    if (!token) return;

    setLoadingChats(true);
    setError("");

    try {
      const data = await chatsApi.fetchChats(token);

      setChats(data.chats || []);
    } catch (err) {
      console.error("LOAD CHATS ERROR:", err);
      setError(err.message);
    } finally {
      setLoadingChats(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadChats();
    }
  }, [token, loadChats]);

  // =========================
  // CREATE NEW CHAT
  // =========================
 async function startNewChat(model) {
  if (!model) {
    setError("Please select a model");
    return null;
  }

  try {
    setError("");

    const data = await chatsApi.createChat(token, model);

    console.log("CREATE CHAT RESPONSE:", data);

    const chat = data.chat;

    if (!chat) {
      throw new Error("Chat was not created");
    }

    // Your backend returns `id`
    const chatId = chat._id;

    if (!chatId) {
      throw new Error("Chat ID is missing");
    }

    setChats((prev) => [
      chat,
      ...prev,
    ]);

    setActiveChatId(chatId);
    setMessages([]);

    return chat;

  } catch (err) {
    console.error("CREATE CHAT ERROR:", err);
    setError(err.message);
    throw err;
  }
}

  // =========================
  // OPEN EXISTING CHAT
  // =========================
  async function openChat(chatId) {
    if (!chatId) {
      console.error("Chat ID is missing");
      return;
    }

    setActiveChatId(chatId);
    setError("");

    try {
      const data = await messagesApi.fetchMessages(
        token,
        chatId
      );

      setMessages(data.messages || []);
    } catch (err) {
      console.error("OPEN CHAT ERROR:", err);

      setError(err.message);
    }
  }


  //delete chat
   async function deleteChat(chatId) {
    if (!chatId) {
      console.error("Chat ID is missing");
      return;
    }

    try {
      setError("");

      await chatsApi.deleteChat(token, chatId);

      // Remove deleted chat from sidebar
      setChats((prev) =>
        prev.filter((chat) => chat._id !== chatId)
      );

      // If currently opened chat is deleted
      if (activeChatId === chatId) {
        setActiveChatId(null);
        setMessages([]);
      }

    } catch (err) {
      console.error("DELETE CHAT ERROR:", err);
      setError(err.message);
    }
  }

  // =========================
  // SEND MESSAGE
  // =========================
  async function send(content, model) {
    const trimmed = content.trim();

    if (!trimmed) return;

    setSending(true);
    setError("");

    try {
      let chatId = activeChatId;

      console.log("ACTIVE CHAT ID:", chatId);

      // Create chat only if there is no active chat
      if (!chatId) {
        const chat = await startNewChat(model);

        if (!chat) {
          throw new Error("Chat was not created");
        }

        // IMPORTANT: use _id
        chatId = chat._id;

        if (!chatId) {
          throw new Error("Chat ID is undefined");
        }

        setActiveChatId(chatId);
      }

      // Send message
      const data = await messagesApi.sendMessage(
        token,
        chatId,
        trimmed
      );

      // Backend response:
      // {
      //   message: "...",
      //   chatId: "...",
      //   userMessage: {...},
      //   assistentMessage: {...}
      // }

     setMessages((prev) => [
        ...prev,
        ...(data.userMessage ? [data.userMessage] : []),
        ...(data.assistentMessage ? [data.assistentMessage] : []),
      ]);

      // Update chat title in frontend
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                topic:
                  !chat.topic ||
                  chat.topic === "Untitled chat" ||
                  chat.topic === "New Chat"
                    ? trimmed.slice(0, 40)
                    : chat.topic,
              }
            : chat
        )
      );

    } catch (err) {
      console.error("SEND MESSAGE ERROR:", err);

      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  // =========================
  // RESET ON LOGOUT
  // =========================
  function resetForSignOut() {
    setChats([]);
    setMessages([]);
    setActiveChatId(null);
    setError("");
  }

  return {
    chats,
    activeChatId,
    messages,
    loadingChats,
    sending,
    error,

    loadChats,
    startNewChat,
    openChat,
    send,
    deleteChat,
    resetForSignOut,
  };
}