import { Send } from "lucide-react";

type ChatInputProps = {
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => void;
};

export default function ChatInput({
  input,
  setInput,
  sendMessage,
}: ChatInputProps) {
  return (
    <div className="p-3 md:p-4 border-t border-white/10 bg-white/5 flex gap-2">

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about the PDF..."
        className="flex-1 bg-black/20 border border-white/10 rounded-2xl px-3 md:px-4 py-2 md:py-3 outline-none text-sm"
      />

      <button
        onClick={sendMessage}
        className="w-10 md:w-12 h-10 md:h-12 rounded-2xl bg-purple-600 flex items-center justify-center"
      >

        <Send size={18} />

      </button>

    </div>
  );
}