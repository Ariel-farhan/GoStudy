'use client';

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Upload, FileText, MessageSquare, Send, ArrowLeft, History } from "lucide-react";
import SummaryPanel from "@/components/summary-panel";
import ChatMessage from "@/components/chat-message";
import { useTheme } from "@/components/theme-provider";
import { t } from "@/lib/i18n";

type Message = { role: string; text: string };
type Session = {
  id: string;
  title: string;
  summary: string | null;
  updatedAt: string;
  messages: { role: string; text: string; createdAt: string }[];
};

export default function WorkspacePage() {
  const searchParams = useSearchParams();
  const { language } = useTheme();
  const tx = t[language];

  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [chat, setChat] = useState<Message[]>([
    { role: "ai", text: tx.uploadPrompt },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/chats")
      .then((r) => r.json())
      .then((data) => setSessions(data.chats || []));
  }, []);

  useEffect(() => {
    const sessionId = searchParams.get("sessionId");
    if (!sessionId || sessions.length === 0) return;
    const found = sessions.find((s) => s.id === sessionId);
    if (found) loadSession(found);
  }, [sessions, searchParams]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isThinking]);

  const loadSession = (s: Session) => {
    setChatId(s.id);
    setSummary(s.summary);
    setUploadedFile(s.title);
    setChat(s.messages.map((m) => ({ role: m.role, text: m.text })));
    setShowHistory(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file.name);
    setSummary(tx.processingPDF);
    setChatId(null);
    setChat([{ role: "ai", text: tx.uploadPrompt }]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/summarize", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        setSummary(data.summary);
        setChat((prev) => [
          ...prev,
          { role: "ai", text: tx.documentReady(file.name) },
        ]);
      } else {
        setSummary("Error: " + data.error);
      }
    } catch (err: any) {
      setSummary("Upload error: " + err.message);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return;

    const userMsg = input;
    setChat((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsThinking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          summary,
          chatId,
          title: uploadedFile || userMsg.slice(0, 50),
        }),
      });

      const data = await res.json();

      if (data.chatId) {
        setChatId(data.chatId);
        fetch("/api/chats")
          .then((r) => r.json())
          .then((d) => setSessions(d.chats || []));
      }

      setChat((prev) => [...prev, { role: "ai", text: data.reply || "No response" }]);
    } catch (err: any) {
      setChat((prev) => [...prev, { role: "ai", text: "Error: " + err.message }]);
    } finally {
      setIsThinking(false);
    }
  };

  const scrollbarStyle = {
    scrollbarWidth: "thin" as const,
    scrollbarColor: "rgba(147,51,234,0.3) transparent",
  };

  return (
    <div className="h-screen bg-[var(--page-bg)] text-[var(--page-text)] flex flex-col">

      {/* TOPBAR */}
      <div className="h-16 border-b border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-xl flex items-center justify-between px-4 md:px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-[var(--muted-text)] hover:text-[var(--page-text)] transition"
        >
          <ArrowLeft size={18} />
          {tx.backToDashboard}
        </Link>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 text-[var(--muted-text)] hover:text-[var(--page-text)] transition text-sm"
        >
          <History size={18} />
          <span className="hidden sm:inline">{tx.previousSessions}</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* HISTORY PANEL */}
        {showHistory && (
          <div className="w-64 flex-shrink-0 border-r border-[var(--card-border)] bg-[var(--card-bg)] p-4 overflow-y-auto" style={scrollbarStyle}>
            <h3 className="font-semibold mb-3 text-sm text-[var(--muted-text)]">{tx.chatSessions}</h3>
            {sessions.length === 0 ? (
              <p className="text-xs text-[var(--muted-text)]">{tx.noSessions}</p>
            ) : (
              sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => loadSession(s)}
                  className={`w-full text-left p-3 rounded-2xl border mb-2 transition text-sm ${
                    chatId === s.id
                      ? "bg-purple-600/20 border-purple-500 text-[var(--page-text)]"
                      : "bg-[var(--card-bg)] border-[var(--card-border)] hover:bg-[var(--card-hover)] text-[var(--page-text)]"
                  }`}
                >
                  <p className="font-medium truncate">{s.title}</p>
                  <p className="text-xs text-[var(--muted-text)] mt-1">
                    {new Date(s.updatedAt).toLocaleDateString(language === "id" ? "id-ID" : "en-US")}
                  </p>
                </button>
              ))
            )}
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

          {/* LEFT - UPLOAD & SUMMARY */}
          <div
            className="w-full lg:w-[55%] border-b lg:border-b-0 lg:border-r border-[var(--card-border)] p-4 md:p-6 flex flex-col gap-6 overflow-y-auto"
            style={scrollbarStyle}
          >
            <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-purple-600/20 flex items-center justify-center">
                  <Upload size={20} className="text-purple-500 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{tx.uploadDocument}</h2>
                  <p className="text-sm text-[var(--muted-text)]">{tx.uploadSubtitle}</p>
                </div>
              </div>

              <label className="flex items-center justify-center gap-3 h-14 rounded-2xl border border-dashed border-purple-500/40 bg-purple-600/10 hover:bg-purple-600/20 transition cursor-pointer text-gray-900 dark:text-white">
                <Upload size={18} />
                <span className="text-sm font-medium">{tx.choosePDF}</span>
                <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
              </label>

              {uploadedFile && (
                <div className="mt-4 p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center gap-3">
                  <FileText size={18} className="text-purple-500 dark:text-purple-400" />
                  <span className="text-sm truncate text-[var(--page-text)]">{uploadedFile}</span>
                </div>
              )}
            </div>

            <SummaryPanel selectedFile={uploadedFile || tx.noDocument} summary={summary} />
          </div>

          {/* RIGHT - CHAT */}
          <div className="w-full lg:w-[45%] flex flex-col overflow-hidden">
            <div
              className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto"
              style={scrollbarStyle}
            >
              <h2 className="text-base md:text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <MessageSquare size={18} />
                {tx.aiChat}
              </h2>

              {chat.map((c, i) => (
                <ChatMessage key={i} role={c.role} text={c.text} />
              ))}

              {isThinking && <ChatMessage role="ai" text="" loading={true} />}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 md:p-4 border-t border-[var(--card-border)] bg-[var(--card-bg)] flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={tx.inputPlaceholder}
                disabled={isThinking}
                className="flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl px-4 py-3 outline-none text-sm text-[var(--page-text)] placeholder:text-[var(--muted-text)] disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={isThinking}
                className="w-12 h-12 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center text-white"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}