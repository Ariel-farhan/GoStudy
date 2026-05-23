'use client';

import { Menu } from "lucide-react";

type TopbarProps = {
  title: string;
  description: string;
  openSidebar?: () => void;
};

export default function Topbar({ title, description, openSidebar }: TopbarProps) {
  return (
    <header className="h-20 border-b border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-between px-6 lg:px-10">
      <div className="flex items-center gap-4">
        <button
          onClick={openSidebar}
          className="lg:hidden p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]"
        >
          <Menu size={28} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--page-text)]">{title}</h1>
          <p className="text-sm text-[var(--muted-text)]">{description}</p>
        </div>
      </div>
    </header>
  );
}