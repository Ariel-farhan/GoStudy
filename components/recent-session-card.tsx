'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, Clock } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { t } from "@/lib/i18n";

type Session = {
  id: string;
  title: string;
  updatedAt: string;
  messages: { role: string; text: string }[];
};

export default function RecentSessionCard() {
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

  const latest = sessions[0];

  return (
    <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 lg:p-8 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-purple-600 dark:text-purple-400 font-medium mb-3">{tx.continueSession}</p>
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {tx.resumeSession}
          </h2>
          <p className="text-[var(--muted-text)] leading-relaxed">
            {tx.resumeSessionDesc}
          </p>
        </div>

        <div className="flex-shrink-0">
          <Link
            href="/sessions"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-2xl bg-purple-600 hover:bg-purple-500 transition font-medium text-white"
          >
            {tx.allSessions}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* LATEST SESSION */}
      {loading ? (
        <div className="text-sm text-[var(--muted-text)] animate-pulse">{tx.loadingSessions}</div>
      ) : latest ? (
        <Link
          href={`/workspace?sessionId=${latest.id}`}
          className="block p-5 rounded-2xl border border-purple-500/30 bg-purple-600/10 hover:bg-purple-600/20 transition"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
                <MessageSquare size={18} className="text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-semibold truncate max-w-xs text-gray-900 dark:text-white">
                  {latest.title}
                </p>
                <p className="text-xs text-[var(--muted-text)] mt-1 flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(latest.updatedAt).toLocaleDateString(
                    language === "id" ? "id-ID" : "en-US",
                    { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }
                  )}
                </p>
              </div>
            </div>
            <ArrowRight size={18} className="text-purple-500 dark:text-purple-400 mt-1 flex-shrink-0" />
          </div>

          {latest.messages.length > 0 && (
            <p className="text-sm text-[var(--muted-text)] mt-3 line-clamp-2">
              {latest.messages[latest.messages.length - 1].text}
            </p>
          )}
        </Link>
      ) : (
        <div className="text-sm text-[var(--muted-text)]">
          {tx.noSessionsSaved}{" "}
          <Link href="/workspace" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300">
            {tx.startNewSession}
          </Link>
        </div>
      )}

    </div>
  );
}