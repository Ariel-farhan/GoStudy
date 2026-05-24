'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import RecentSessionCard from "@/components/recent-session-card";
import { useTheme } from "@/components/theme-provider";
import { t } from "@/lib/i18n";
import { MessageSquare, FileText } from "lucide-react";

type Activity = {
  id: string;
  role: string;
  text: string;
  createdAt: string;
  chat: { title: string; id: string };
};

function timeAgo(dateStr: string, language: "id" | "en") {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (language === "en") {
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  }

  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days === 1) return "Kemarin";
  return `${days} hari lalu`;
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { language } = useTheme();
  const tx = t[language];
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/chats")
      .then((r) => r.json())
      .then((data) => {
        const chats = data.chats || [];
        const allMessages: Activity[] = chats.flatMap((chat: any) =>
          chat.messages.map((msg: any) => ({
            ...msg,
            chat: { title: chat.title, id: chat.id },
          }))
        );
        allMessages.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setActivities(allMessages.slice(0, 5));
      })
      .finally(() => setLoadingActivity(false));
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center text-sm text-[var(--muted-text)]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)] flex">
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 lg:hidden z-40" />
      )}

      <Sidebar pathname="/dashboard" sidebarOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0">
        <Topbar
          title="Dashboard"
          description={tx.heroDesc}
          openSidebar={() => setSidebarOpen(true)}
        />

        <div className="p-5 lg:p-8 space-y-5">

          {/* HERO */}
          <section className="rounded-2xl bg-gradient-to-r from-purple-600/15 to-blue-600/15 border border-[var(--card-border)] p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <p className="text-purple-500 dark:text-purple-400 text-sm font-medium mb-1.5">
                  {tx.welcomeBack}
                </p>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                  {tx.hello(session?.user?.name ?? (language === "id" ? "Pelajar" : "Learner"))}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-lg">
                  {tx.heroDesc}
                </p>
              </div>
              <Link
                href="/workspace"
                className="self-start sm:self-center shrink-0 inline-flex items-center h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 transition text-sm font-medium text-white"
              >
                {tx.openWorkspace}
              </Link>
            </div>
          </section>

          <RecentSessionCard />

          {/* RECENT ACTIVITY */}
          <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
            <h2 className="text-sm font-semibold mb-4 text-gray-900 dark:text-white">
              {tx.recentActivity}
            </h2>

            {loadingActivity ? (
              <p className="text-sm text-[var(--muted-text)] animate-pulse">{tx.loadingActivity}</p>
            ) : activities.length === 0 ? (
              <p className="text-sm text-[var(--muted-text)]">{tx.noActivity}</p>
            ) : (
              <div className="space-y-1">
                {activities.map((activity, i) => (
                  <Link
                    key={activity.id}
                    href={`/workspace?sessionId=${activity.chat.id}`}
                    className={`flex items-center justify-between gap-3 text-sm py-2.5 text-[var(--muted-text)] hover:text-[var(--page-text)] transition ${
                      i < activities.length - 1 ? "border-b border-[var(--card-border)]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-purple-600/15 flex items-center justify-center shrink-0">
                        {activity.role === "user"
                          ? <MessageSquare size={13} className="text-purple-500 dark:text-purple-400" />
                          : <FileText size={13} className="text-blue-500 dark:text-blue-400" />
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-gray-800 dark:text-gray-200 text-sm">
                          {activity.role === "user" ? tx.youAsked : tx.aiAnswered}{" "}
                          {tx.inChat}{" "}
                          <span className="font-medium">{activity.chat.title}</span>
                        </p>
                        <p className="text-xs text-[var(--muted-text)] truncate mt-0.5">
                          {activity.text}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[var(--muted-text)] shrink-0">
                      {timeAgo(activity.createdAt, language)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}