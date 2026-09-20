export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap text-[15px] leading-7 ${
          isUser
            ? "rounded-2xl bg-neutral-800 px-4 py-3 text-white"
            : "text-neutral-200"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
