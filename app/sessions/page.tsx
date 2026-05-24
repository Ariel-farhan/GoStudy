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
      <header className="h-14 border-b border-[var(--card-border)] bg-[var(--card-bg)] flex items-center px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-[var(--muted-text)] hover:text-[var(--page-text)] transition"
        >
          <ArrowLeft size={15} />
          {tx.backToDashboard}
        </Link>
      </header>

      <main className="p-5 lg:p-8">
        <div className="max-w-4xl mx-auto">

          {/* HEADER */}
          <div className="mb-7">
            <p className="text-purple-500 dark:text-purple-400 text-sm font-medium mb-1.5">
              {tx.studySessions}
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              {tx.continueYourLearning}
            </h1>
            <p className="text-sm text-[var(--muted-text)] max-w-lg">{tx.sessionsDesc}</p>
          </div>

          {loading && (
            <p className="text-sm text-[var(--muted-text)] animate-pulse">{tx.loadingSessions}</p>
          )}

          {!loading && sessions.length === 0 && (
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 text-center">
              <p className="text-sm text-[var(--muted-text)] mb-4">{tx.noSessionsSaved}</p>
              <Link
                href="/workspace"
                className="inline-flex h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 transition items-center text-sm font-medium text-white"
              >
                {tx.startNewSession}
              </Link>
            </div>
          )}

          <div className="space-y-3">
            {sessions.map((session) => {
              const aiMessages = session.messages.filter((m) => m.role === "ai");
              const lastMessage = session.messages[session.messages.length - 1];

              return (
                <Link
                  key={session.id}
                  href={`/workspace?sessionId=${session.id}`}
                  className="block rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--card-hover)] transition p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div className="space-y-2 flex-1 min-w-0">
                      <h2 className="text-base font-semibold truncate text-gray-900 dark:text-white">
                        {session.title}
                      </h2>

                      <div className="flex flex-wrap gap-3 text-xs text-[var(--muted-text)]">
                        <span className="flex items-center gap-1.5">
                          <Clock3 size={13} />
                          {new Date(session.updatedAt).toLocaleDateString(
                            language === "id" ? "id-ID" : "en-US",
                            { day: "numeric", month: "short", year: "numeric" }
                          )}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MessageSquare size={13} />
                          {tx.messages(session.messages.length)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FileText size={13} />
                          {aiMessages.length > 0 ? tx.summaryAvailable : tx.noSummaryYet}
                        </span>
                      </div>

                      {lastMessage && (
                        <p className="text-xs text-[var(--muted-text)] line-clamp-1">
                          {lastMessage.text}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0">
                      <div className="inline-flex h-9 px-4 rounded-xl bg-purple-600 items-center justify-center text-sm font-medium text-white">
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