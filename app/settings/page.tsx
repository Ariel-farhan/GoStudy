'use client';

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useTheme } from "@/components/theme-provider";
import { t } from "@/lib/i18n";
import { Moon, Globe, Info, LogOut, AlertTriangle, MessageSquare, Send } from "lucide-react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import ToggleItem from "@/components/toggle-item";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { darkMode, toggleTheme, language, setLanguage } = useTheme();
  const tx = t[language];

  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleFeedback = async () => {
    if (!feedback.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: feedback }),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
      setFeedback("");
      setTimeout(() => setSent(false), 3000);
    } catch {
      setError("Gagal mengirim feedback. Coba lagi.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)] flex">

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--page-bg)] border border-[var(--card-border)] rounded-2xl p-6 max-w-xs w-full mx-4 shadow-2xl">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle size={22} className="text-red-500 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold mb-1 text-gray-900 dark:text-white">{tx.logoutTitle}</h3>
                <p className="text-sm text-[var(--muted-text)]">{tx.logoutDesc}</p>
              </div>
              <div className="flex gap-2 w-full mt-1">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 h-10 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--card-hover)] transition text-sm font-medium"
                >
                  {tx.cancel}
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex-1 h-10 rounded-xl bg-red-600/20 border border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-600/30 transition text-sm font-medium"
                >
                  {tx.logout}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 lg:hidden z-40" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar pathname="/settings" sidebarOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col">
        <Topbar title="Settings" description={tx.settingsDesc} openSidebar={() => setSidebarOpen(true)} />

        <div className="p-5 lg:p-8 space-y-4">

          {/* PREFERENCES */}
          <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
            <h2 className="text-sm font-semibold mb-4 text-gray-900 dark:text-white">{tx.preferences}</h2>
            <div className="space-y-3">
              <ToggleItem label={tx.darkMode} icon={<Moon size={16} />} enabled={darkMode} onToggle={toggleTheme} />
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                <div className="flex items-center gap-2.5 text-sm text-[var(--page-text)]">
                  <Globe size={16} />
                  <span>{tx.language}</span>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "id" | "en")}
                  className="bg-transparent text-sm text-[var(--muted-text)] outline-none cursor-pointer"
                >
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </section>

          {/* FEEDBACK */}
          <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <MessageSquare size={15} />
              Feedback
            </h2>
            <div className="space-y-2.5">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tulis saran, kritik, atau laporan bug..."
                rows={3}
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--page-bg)] text-[var(--page-text)] placeholder:text-[var(--muted-text)] p-3 text-sm outline-none resize-none focus:border-blue-500 transition"
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                onClick={handleFeedback}
                disabled={sending || !feedback.trim()}
                className="flex items-center gap-2 px-4 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-white text-sm font-medium"
              >
                <Send size={13} />
                {sent ? "Terkirim!" : sending ? "Mengirim..." : "Kirim Feedback"}
              </button>
            </div>
          </section>

          {/* ABOUT */}
          <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <Info size={15} />
              {tx.aboutWorkspace}
            </h2>
            <div className="text-sm text-[var(--muted-text)] space-y-1">
              <p className="font-semibold text-gray-900 dark:text-white">StudyAI Workspace</p>
              <p>{tx.aboutDesc}</p>
              <p className="text-xs">Version 1.0.0</p>
            </div>
          </section>

          {/* ACCOUNT */}
          <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <LogOut size={15} />
              {tx.account}
            </h2>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="h-10 px-5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-600/30 transition text-sm font-medium"
            >
              {tx.logout}
            </button>
          </section>

        </div>
      </main>
    </div>
  );
}