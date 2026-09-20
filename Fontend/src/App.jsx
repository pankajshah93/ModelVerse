import { useState } from "react";

import { useAuth } from "./hooks/useAuth";
import { useChats } from "./hooks/useChats";

import LandingPage from "./Components/chat/LandingPage";
import ChatPage from "./Components/chat/ChatPage";
import AuthModal from "./Components/auth/AuthModal";

import "./App.css";

function App() {
  // Authentication state
  const auth = useAuth();

  // Chat state
  const chats = useChats(auth.token);

  // Message input state
  const [draft, setDraft] = useState("");

  // Selected AI model
  const [selectedModel, setSelectedModel] = useState("google/gemini-3.5-flash-20260519");

  // null | "login" | "signup"
  const [authMode, setAuthMode] = useState(null);


  // =========================
  // AUTHENTICATION
  // =========================

  async function handleAuthSubmit(view, form) {
    if (view === "login") {
      await auth.signIn({
        email: form.email,
        password: form.password,
      });
    } else {
      await auth.signUp({
        name: form.name,
        age: form.age,
        email: form.email,
        password: form.password,
      });
    }

    // Close modal after successful authentication
    setAuthMode(null);
  }


  // =========================
  // LANDING PAGE MESSAGE
  // =========================

  function handleLandingSubmit() {
    if (!draft.trim()) return;

    // User must log in before sending a message
    setAuthMode("signup");
  }


  // =========================
  // CHAT MESSAGE
  // =========================

  async function handleChatSubmit() {
    if (!draft.trim()) return;

    // Save current message before clearing textarea
    const message = draft;

    // Clear input
    setDraft("");

    // Send message + selected model
    await chats.send(message, selectedModel);
  }


  // =========================
  // NOT LOGGED IN
  // =========================

  if (!auth.isAuthenticated) {
    return (
      <>
        <LandingPage
          draft={draft}
          onDraftChange={setDraft}
          onSubmit={handleLandingSubmit}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          onOpenLogin={() => setAuthMode("login")}
          onOpenSignup={() => setAuthMode("signup")}
        />

        <AuthModal
          open={authMode !== null}
          onClose={() => setAuthMode(null)}
          onSubmit={handleAuthSubmit}
          initialView={authMode || "login"}
        />
      </>
    );
  }


  // =========================
  // LOGGED IN
  // =========================

  return (
    <ChatPage
      // Chats
      chats={chats.chats}
      activeChatId={chats.activeChatId}
      loadingChats={chats.loadingChats}

      // Create a new chat using selected model
      onNewChat={() =>
        chats.startNewChat(selectedModel)
      }

      // Open existing chat
      onOpenChat={chats.openChat}

       // DELETE CHAT
      onDeleteChat={chats.deleteChat}

      // User
      user={auth.user}
      onSignOut={auth.signOut}

      // Messages
      messages={chats.messages}
      sending={chats.sending}
      error={chats.error}

      // Message input
      draft={draft}
      onDraftChange={setDraft}
      onSubmit={handleChatSubmit}

      // Model
      selectedModel={selectedModel}
      onSelectModel={setSelectedModel}
    />
  );
}

export default App;