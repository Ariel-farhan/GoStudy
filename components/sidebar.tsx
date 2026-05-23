'use client';

import Link from "next/link";
import { LayoutDashboard, Brain, Settings } from "lucide-react";

type SidebarProps = {
  pathname?: string;
  sidebarOpen?: boolean;
  closeSidebar?: () => void;
};

export default function Sidebar({ pathname, sidebarOpen, closeSidebar }: SidebarProps) {
  return (
    <aside
      className={`
        fixed lg:static z-50 h-full w-72
        bg-[var(--card-bg)] backdrop-blur-xl border-r border-[var(--card-border)]
        transform transition-transform duration-300
        flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* LOGO */}
      <div className="h-20 flex items-center px-8 border-b border-[var(--card-border)]">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white">
          S
        </div>
        <div className="ml-4">
          <h1 className="text-xl font-bold text-[var(--page-text)]">StudyAI</h1>
          <p className="text-sm text-[var(--muted-text)]">AI Workspace</p>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-6 space-y-3">
        <SidebarItem
          href="/dashboard"
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          active={pathname === "/dashboard"}
          onClick={closeSidebar}
        />
        <SidebarItem
          href="/workspace"
          icon={<Brain size={20} />}
          label="Workspace"
          active={pathname === "/workspace"}
          onClick={closeSidebar}
        />
        <SidebarItem
          href="/settings"
          icon={<Settings size={20} />}
          label="Settings"
          active={pathname === "/settings"}
          onClick={closeSidebar}
        />
      </nav>
    </aside>
  );
}

type SidebarItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

function SidebarItem({ href, icon, label, active, onClick }: SidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition ${
        active
          ? "bg-purple-600 text-white"
          : "text-[var(--muted-text)] hover:text-[var(--page-text)] hover:bg-[var(--card-hover)]"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}