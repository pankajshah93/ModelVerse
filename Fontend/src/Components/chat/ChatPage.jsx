import Sidebar from "./Sidebar.jsx";
import MessageList from "./MessageList.jsx";
import MessageInput from "./MessageInput.jsx";

export default function ChatPage({
  // sidebar / chats
  chats,
  activeChatId,
  loadingChats,
  onNewChat,
  onOpenChat,
  onDeleteChat,
  user,
  onSignOut,
  // messages
  messages,
  sending,
  error,
  // composer
  draft,
  onDraftChange,
  onSubmit,
  selectedModel,
  onSelectModel,
}) {
  return (
    <div className="flex h-screen w-full bg-neutral-950 text-neutral-100">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        loadingChats={loadingChats}
        onNewChat={onNewChat}
        onOpenChat={onOpenChat}
        onDeleteChat={onDeleteChat}
        user={user}
        onSignOut={onSignOut}
      />

      <main className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-800 px-4 md:px-6">
          <span className="font-medium">AI Chat</span>
          <span className="text-sm text-neutral-500">{selectedModel}</span>
        </header>

        <MessageList messages={messages} sending={sending} />

        {error && (
          <div className="absolute bottom-32 left-0 right-0 mx-auto max-w-3xl px-4">
            <p className="rounded-lg bg-red-950/50 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-neutral-950 via-neutral-950 to-transparent px-4 pb-5 pt-12">
          <div className="mx-auto w-full max-w-3xl">
            <MessageInput
              draft={draft}
              onDraftChange={onDraftChange}
              onSubmit={onSubmit}
              selectedModel={selectedModel}
              onSelectModel={onSelectModel}
              sending={sending}
              rows={2}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
