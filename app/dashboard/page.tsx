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
    if (mins < 60) return `${mins} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
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

  const closeSidebar = () => setSidebarOpen(false);

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
      <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)] flex">

      {sidebarOpen && (
        <div onClick={closeSidebar} className="fixed inset-0 bg-black/50 lg:hidden z-40" />
      )}

      <Sidebar pathname="/dashboard" sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />

      <main className="flex-1 flex flex-col">

        <Topbar
          title="Dashboard"
          description={tx.heroDesc}
          openSidebar={() => setSidebarOpen(true)}
        />

        <div className="p-6 lg:p-10 space-y-8">

          {/* HERO */}
          <section className="rounded-3xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-[var(--card-border)] p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-2xl">
                <p className="text-purple-600 dark:text-purple-400 font-medium mb-3">{tx.welcomeBack}</p>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-5 text-gray-900 dark:text-white">
                  {tx.hello(session?.user?.name ?? (language === "id" ? "Pelajar" : "Learner"))}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-base lg:text-lg leading-relaxed">
                  {tx.heroDesc}
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  href="/workspace"
                  className="inline-flex items-center justify-center h-14 px-7 rounded-2xl bg-purple-600 hover:bg-purple-500 transition font-medium text-lg text-white"
                >
                  {tx.openWorkspace}
                </Link>
              </div>
            </div>
          </section>

          <RecentSessionCard />

          {/* RECENT ACTIVITY */}
          <section className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <h2 className="text-lg font-semibold mb-5 text-gray-900 dark:text-white">{tx.recentActivity}</h2>

            {loadingActivity ? (
              <p className="text-sm text-[var(--muted-text)] animate-pulse">{tx.loadingActivity}</p>
            ) : activities.length === 0 ? (
              <p className="text-sm text-[var(--muted-text)]">{tx.noActivity}</p>
            ) : (
              <div className="space-y-3">
                {activities.map((activity, i) => (
                  <Link
                    key={activity.id}
                    href={`/workspace?sessionId=${activity.chat.id}`}
                    className={`flex items-center justify-between text-sm text-[var(--muted-text)] hover:text-[var(--page-text)] transition pb-3 ${
                      i < activities.length - 1 ? "border-b border-[var(--card-border)]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                        {activity.role === "user" ? (
                          <MessageSquare size={14} className="text-purple-500 dark:text-purple-400" />
                        ) : (
                          <FileText size={14} className="text-blue-500 dark:text-blue-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-gray-900 dark:text-white">
                          {activity.role === "user" ? tx.youAsked : tx.aiAnswered} {tx.inChat}{" "}
                          <span className="font-medium">{activity.chat.title}</span>
                        </p>
                        <p className="text-xs text-[var(--muted-text)] truncate">{activity.text}</p>
                      </div>
                    </div>
                    <span className="text-[var(--muted-text)] flex-shrink-0 ml-4">
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