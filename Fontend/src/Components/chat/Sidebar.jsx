import {
  LogOut,
  MessageSquare,
  Plus,
  User,
  Trash2,
} from "lucide-react";
import logo from "../../assets/modelverse-icon.svg"

export default function Sidebar({
  chats,
  activeChatId,
  loadingChats,
  onNewChat,
  onOpenChat,
  onDeleteChat,
  user,
  onSignOut,
}) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-neutral-800 bg-neutral-900 md:flex">

       <div className="flex flex-col items-center justify-center border-b border-neutral-800 ">
  
  <div className="flex items-center gap-2">
    {/* Logo */}
    <img
      src={logo}
      alt="ModelVerse logo"
      className="h-10 w-10 object-contain"
    />

    {/* Brand Name */}
    <h1 className="text-[40px] font-bold ">
      <span className="text-white text-[40px] ">Model</span>
      <span className="bg-linear-to-r from-cyan-400 text-[40px] via-blue-500 to-purple-500 bg-clip-text text-transparent">
        Verse
      </span>
    </h1>
  </div>

  <p className="text-xs mb-2 font-medium tracking-[0.18em] text-neutral-500">
    MULTI AI PLATFORM
  </p>

</div>

      {/* NEW CHAT */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2.5 text-sm font-medium hover:bg-neutral-800"
        >
          <Plus size={17} />
          New chat
        </button>
      </div>

      {/* CHAT LIST */}
      <div className="flex-1 space-y-1 overflow-y-auto px-2">

        {loadingChats && (
          <p className="px-2 py-3 text-xs text-neutral-500">
            Loading chats...
          </p>
        )}

        {!loadingChats && chats.length === 0 && (
          <p className="px-2 py-3 text-xs text-neutral-500">
            No chats yet.
          </p>
        )}

        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              activeChatId === chat._id
                ? "bg-neutral-800 text-white"
                : "text-neutral-400 hover:bg-neutral-800"
            }`}
          >
            {/* OPEN CHAT */}
            <button
              onClick={() => onOpenChat(chat._id)}
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
            >
              <MessageSquare size={14} />

              <span className="truncate">
                {chat.topic || "Untitled chat"}
              </span>
            </button>

            {/* DELETE CHAT */}
            <button
              onClick={(e) => {
                e.stopPropagation();

                const confirmDelete = window.confirm(
                  "Are you sure you want to delete this chat?"
                );

                if (confirmDelete) {
                  onDeleteChat(chat._id);
                }
              }}
              className="rounded p-1 text-neutral-500 opacity-0 transition hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
              title="Delete chat"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* USER SECTION */}
      <div className="flex items-center justify-between border-t border-neutral-800 p-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-700">
            <User size={15} />
          </div>

          <span className="truncate text-sm text-neutral-300">
            {user?.name || user?.email || "Account"}
          </span>
        </div>

        <button
          onClick={onSignOut}
          className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-800 hover:text-white"
        >
          <LogOut size={16} />
        </button>
      </div>

    </aside>
  );
}