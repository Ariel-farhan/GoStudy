'use client';

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useTheme } from "@/components/theme-provider";
import { t } from "@/lib/i18n";

import {
  Moon,
  Globe,
  Info,
  LogOut,
  AlertTriangle,
  MessageSquare,
  Send,
} from "lucide-react";

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

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)] flex">

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--page-bg)] border border-[var(--card-border)] rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-500 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{tx.logoutTitle}</h3>
                <p className="text-[var(--muted-text)] text-sm">{tx.logoutDesc}</p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 h-11 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--card-hover)] transition text-sm font-medium text-[var(--page-text)]"
                >
                  {tx.cancel}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 h-11 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-600/30 transition text-sm font-medium"
                >
                  {tx.logout}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        pathname="/settings"
        sidebarOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col">

        <Topbar
          title="Settings"
          description={tx.settingsDesc}
          openSidebar={() => setSidebarOpen(true)}
        />

        <div className="p-6 lg:p-10 space-y-8">

          {/* PREFERENCES */}
          <section className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">{tx.preferences}</h2>
            <div className="space-y-4">

              <ToggleItem
                label={tx.darkMode}
                icon={<Moon size={18} />}
                enabled={darkMode}
                onToggle={toggleTheme}
              />

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                <div className="flex items-center gap-3 text-[var(--page-text)]">
                  <Globe size={18} />
                  <span>{tx.language}</span>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "id" | "en")}
                  className="bg-transparent text-[var(--muted-text)] outline-none cursor-pointer"
                >
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>

            </div>
          </section>

          {/* FEEDBACK */}
          <section className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <MessageSquare size={18} />
              Feedback
            </h2>
            <div className="space-y-3">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tulis saran, kritik, atau laporan bug..."
                rows={4}
                className="w-full rounded-2xl border border-[var(--card-border)] bg-[var(--page-bg)] text-[var(--page-text)] placeholder:text-[var(--muted-text)] p-4 text-sm outline-none resize-none focus:border-blue-500 transition"
              />
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <button
                onClick={handleFeedback}
                disabled={sending || !feedback.trim()}
                className="flex items-center gap-2 px-5 h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-white text-sm font-medium"
              >
                <Send size={15} />
                {sent ? "Terkirim!" : sending ? "Mengirim..." : "Kirim Feedback"}
              </button>
            </div>
          </section>

          {/* ABOUT */}
          <section className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <Info size={18} />
              {tx.aboutWorkspace}
            </h2>
            <div className="text-[var(--muted-text)] space-y-2">
              <p className="font-semibold text-gray-900 dark:text-white">StudyAI Workspace</p>
              <p>{tx.aboutDesc}</p>
              <p className="text-sm text-[var(--muted-text)]">Version 1.0.0</p>
            </div>
          </section>

          {/* ACCOUNT */}
          <section className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <LogOut size={18} />
              {tx.account}
            </h2>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full h-12 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-600/30 transition"
            >
              {tx.logout}
            </button>
          </section>

        </div>

      </main>

    </div>
  );
}