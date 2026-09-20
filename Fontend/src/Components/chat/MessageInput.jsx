import { Loader2, Send } from "lucide-react";
import ModelSelector from "./ModelSelector.jsx";

export default function MessageInput({
  draft,
  onDraftChange,
  onSubmit,
  selectedModel,
  onSelectModel,
  sending = false,
  rows = 3,
}) {

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      onSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">

      <div className="relative rounded-2xl border border-neutral-700 bg-neutral-900 shadow-xl">

        <textarea
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message AI..."
          rows={rows}
          className="block w-full resize-none bg-transparent px-5 pb-16 pt-4 text-[15px] text-white outline-none placeholder:text-neutral-500"
        />

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">

          <ModelSelector
            selectedModel={selectedModel}
            onSelect={onSelectModel}
          />

          <button
            type="submit"
            disabled={sending || !draft.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black hover:bg-neutral-200 disabled:opacity-30"
          >
            {sending ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Send size={17} />
            )}
          </button>

        </div>

      </div>

      <p className="mt-2 text-center text-[11px] text-neutral-600">
        AI can make mistakes. Check important information.
      </p>

    </form>
  );
}