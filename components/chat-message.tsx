type ChatMessageProps = {
  role: string;
  text: string;
  loading?: boolean;
};

export default function ChatMessage({ role, text, loading }: ChatMessageProps) {
  return (
    <div
      className={`max-w-[85%] p-3 md:p-4 rounded-2xl text-sm ${
        role === "user"
          ? "ml-auto bg-purple-600 text-white"
          : "bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--page-text)]"
      }`}
    >
      {loading ? (
        <div className="flex items-center gap-1.5 py-1">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" />
        </div>
      ) : (
        <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
      )}
    </div>
  );
}