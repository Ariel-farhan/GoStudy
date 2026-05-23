'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock3, MessageSquare, FileText, ArrowLeft } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { t } from "@/lib/i18n";

type Session = {
  id: string;
  title: string;
  updatedAt: string;
  messages: { role: string; text: string }[];
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useTheme();
  const tx = t[language];

  useEffect(() => {
    fetch("/api/chats")
      .then((r) => r.json())
      .then((data) => setSessions(data.chats || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)]">

      {/* TOPBAR */}
      <header className="h-20 border-b border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-xl flex items-center px-6 lg:px-10">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-[var(--muted-text)] hover:text-[var(--page-text)] transition"
        >
          <ArrowLeft size={18} />
          {tx.backToDashboard}
        </Link>
      </header>

      {/* CONTENT */}
      <main className="p-6 lg:p-10">
        <div className="max-w-5xl mx-auto">

          {/* HEADER */}
          <div className="mb-10">
            <p className="text-purple-600 dark:text-purple-400 font-medium mb-3">{tx.studySessions}</p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">{tx.continueYourLearning}</h1>
            <p className="text-[var(--muted-text)] max-w-2xl">{tx.sessionsDesc}</p>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="text-[var(--muted-text)] animate-pulse text-sm">{tx.loadingSessions}</div>
          )}

          {/* EMPTY */}
          {!loading && sessions.length === 0 && (
            <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-10 text-center">
              <p className="text-[var(--muted-text)] mb-4">{tx.noSessionsSaved}</p>
              <Link
                href="/workspace"
                className="inline-flex h-12 px-6 rounded-2xl bg-purple-600 hover:bg-purple-500 transition items-center font-medium text-white"
              >
                {tx.startNewSession}
              </Link>
            </div>
          )}

          {/* SESSION LIST */}
          <div className="space-y-5">
            {sessions.map((session) => {
              const aiMessages = session.messages.filter((m) => m.role === "ai");
              const lastMessage = session.messages[session.messages.length - 1];

              return (
                <Link
                  key={session.id}
                  href={`/workspace?sessionId=${session.id}`}
                  className="block rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--card-hover)] transition p-6 lg:p-8"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    {/* LEFT */}
                    <div className="space-y-3 flex-1">
                      <h2 className="text-2xl font-bold truncate text-gray-900 dark:text-white">{session.title}</h2>

                      <div className="flex flex-col sm:flex-row gap-4 text-sm text-[var(--muted-text)]">
                        <div className="flex items-center gap-2">
                          <Clock3 size={16} />
                          {new Date(session.updatedAt).toLocaleDateString(
                            language === "id" ? "id-ID" : "en-US",
                            { day: "numeric", month: "long", year: "numeric" }
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare size={16} />
                          {tx.messages(session.messages.length)}
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText size={16} />
                          {aiMessages.length > 0 ? tx.summaryAvailable : tx.noSummaryYet}
                        </div>
                      </div>

                      {lastMessage && (
                        <p className="text-sm text-[var(--muted-text)] line-clamp-2">
                          {lastMessage.text}
                        </p>
                      )}
                    </div>

                    {/* RIGHT */}
                    <div className="flex-shrink-0">
                      <div className="inline-flex h-12 px-6 rounded-2xl bg-purple-600 items-center justify-center font-medium text-white">
                        {tx.openSession}
                      </div>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </main>

    </div>
  );
}