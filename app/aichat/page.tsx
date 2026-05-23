'use client';

import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";

export default function ChatSummaryPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">

      {/* TOP BAR */}
      <div className="h-20 border-b border-white/10 flex items-center px-6 gap-4">

        <Link
          href="/dashboard"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-xl font-bold">AI Chat History</h1>
          <p className="text-xs text-gray-400">
            Overview of your conversations with AI
          </p>
        </div>

      </div>

      {/* CONTENT */}
      <div className="p-6 lg:p-10 space-y-4">

        <ChatCard
          title="Database Systems Discussion"
          time="30 minutes ago"
          preview="User asked about normalization, and AI explained 1NF, 2NF, 3NF with examples of relational database tables..."
        />

        <ChatCard
          title="Machine Learning Q&A"
          time="2 hours ago"
          preview="Discussion about supervised vs unsupervised learning, including examples of KNN and Decision Tree algorithms..."
        />

        <ChatCard
          title="Cloud Computing Basics"
          time="1 day ago"
          preview="User asked about differences between IaaS, PaaS, SaaS and real-world cloud deployment use cases..."
        />

      </div>

    </div>
  );
}

/* CHAT CARD */
function ChatCard({
  title,
  time,
  preview,
}: {
  title: string;
  time: string;
  preview: string;
}) {
  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-3">

        <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
          <MessageSquare size={18} className="text-blue-400" />
        </div>

        <div>
          <p className="font-medium">{title}</p>
          <p className="text-xs text-gray-400">{time}</p>
        </div>

      </div>

      {/* PREVIEW */}
      <p className="text-sm text-gray-300 leading-relaxed">
        {preview}
      </p>

    </div>
  );
}