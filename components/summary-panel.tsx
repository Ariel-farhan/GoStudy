import { Brain } from "lucide-react";

export default function SummaryPanel({
  selectedFile,
  summary,
}: {
  selectedFile: string;
  summary: string | null;
}) {
  return (
    <div className="flex-1 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 flex flex-col min-h-[500px]">

      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-purple-600/20 flex items-center justify-center">
          <Brain size={20} className="text-purple-500 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Summary</h2>
          <p className="text-sm text-[var(--muted-text)]">AI-generated document overview</p>
        </div>
      </div>

      <div
        className="flex-1 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(147,51,234,0.3) transparent",
        }}
      >
        <p className="font-semibold text-gray-900 dark:text-white mb-4">{selectedFile}</p>
        <div className="text-sm text-[var(--muted-text)] leading-relaxed whitespace-pre-wrap">
          {summary ?? "Upload a PDF to see the AI-generated summary here."}
        </div>
      </div>

    </div>
  );
}