import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import MessageBubble from "./MessageBubble.jsx";

export default function MessageList({ messages, sending }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pb-44 pt-6"
      >
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">How can I help you?</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Start a new conversation below.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-44 pt-6">
      <div className="mx-auto max-w-3xl space-y-7">
        {messages.map((message) => (
          <MessageBubble key={message._id} message={message} />
        ))}

        {sending && (
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Loader2 size={16} className="animate-spin" />
            AI is thinking...
          </div>
        )}
      </div>
    </div>
  );
}
