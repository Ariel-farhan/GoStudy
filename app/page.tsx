'use client';

import { useRouter } from "next/navigation";
import { Brain, FileText, MessageSquare, Zap, ArrowRight, BookOpen } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <FileText size={20} />,
      title: "PDF Summarizer",
      description: "Upload PDF apapun dan dapatkan ringkasan terstruktur dalam hitungan detik menggunakan AI.",
    },
    {
      icon: <MessageSquare size={20} />,
      title: "AI Chat",
      description: "Tanya apa saja tentang dokumen kamu. AI akan menjawab berdasarkan isi materi.",
    },
    {
      icon: <Brain size={20} />,
      title: "Smart Analysis",
      description: "AI menganalisis dokumen secara mendalam dan menghasilkan poin-poin penting secara otomatis.",
    },
    {
      icon: <Zap size={20} />,
      title: "Cepat & Efisien",
      description: "Hemat waktu belajar hingga 70%. Pahami materi panjang hanya dalam beberapa menit.",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)] relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-purple-800/10 blur-3xl rounded-full" />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-[var(--card-border)] bg-[var(--page-bg)]/80 backdrop-blur-xl flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-base font-bold text-white">
            S
          </div>
          <span className="text-base font-bold">go study</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-1.5 rounded-xl text-sm text-[var(--muted-text)] hover:text-[var(--page-text)] transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/register")}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-medium text-white transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs mb-6">
          <Zap size={12} />
          Powered by Gemini AI
        </div>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 max-w-3xl">
          Belajar Lebih{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            Cerdas
          </span>{" "}
          dengan AI
        </h1>

        <p className="text-[var(--muted-text)] text-base md:text-lg max-w-xl mb-8 leading-relaxed">
          Upload materi PDF kamu, dapatkan ringkasan instan, dan tanya langsung ke AI.
          Belajar tidak pernah semudah dan secepat ini.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push("/register")}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-base text-white hover:opacity-90 transition"
          >
            Mulai Gratis
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => router.push("/login")}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--card-hover)] font-semibold text-base transition"
          >
            <BookOpen size={18} />
            Login
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row gap-8 mt-12 text-center">
          {[
            { value: "10x", label: "Lebih Cepat Belajar" },
            { value: "100%", label: "Powered by AI" },
            { value: "Free", label: "Untuk Dicoba" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-2xl font-bold text-purple-400">{stat.value}</p>
              <p className="text-[var(--muted-text)] text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-4 md:px-12 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Semua yang Kamu Butuhkan</h2>
          <p className="text-[var(--muted-text)] text-base max-w-xl mx-auto">
            Fitur lengkap untuk membantu kamu memahami materi lebih cepat dan efisien.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--card-hover)] transition flex flex-col gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-400">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="text-[var(--muted-text)] text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-xl mx-auto p-10 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)]">
          <h2 className="text-3xl font-bold mb-3">
            Siap Belajar Lebih{" "}
            <span className="text-purple-400">Cerdas?</span>
          </h2>
          <p className="text-[var(--muted-text)] text-sm mb-6">
            Bergabung sekarang dan rasakan perbedaannya.
          </p>
          <button
            onClick={() => router.push("/register")}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-base text-white hover:opacity-90 transition mx-auto"
          >
            Mulai Sekarang
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--card-border)] py-6 text-center text-[var(--muted-text)] text-xs">
        <p>© 2025 StudyAI. All rights reserved.</p>
      </footer>

    </div>
  );
}