import MessageInput from "./MessageInput.jsx";
import logo from "../../assets/modelverse-icon.svg"

export default function LandingPage({
  draft,
  onDraftChange,
  onSubmit,
  selectedModel,
  onSelectModel,
  onOpenLogin,
  onOpenSignup,
}) {
  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-white">
      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-10">
        <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="ModelVerse Logo"
          className="h-10 w-auto"
        />
         <span className="text-xl font-semibold">
             ModelVerse
          </span>
        </div>
        <div className="text-xl font-semibold">AI Chat</div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLogin}
            className="rounded-lg px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white"
          >
            Log in
          </button>

          <button
            onClick={onOpenSignup}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200"
          >
            Sign up
          </button>
        </div>
      </header>

      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold md:text-4xl">
            How can I help you?
          </h1>
          <p className="mt-3 text-sm text-neutral-500">
            Ask anything and start a conversation with AI.
          </p>
        </div>

        <MessageInput
          draft={draft}
          onDraftChange={onDraftChange}
          onSubmit={onSubmit}
          selectedModel={selectedModel}
          onSelectModel={onSelectModel}
        />
      </main>
    </div>
  );
}
