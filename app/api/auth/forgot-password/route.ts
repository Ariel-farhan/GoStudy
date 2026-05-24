'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError(data.error || "Terjadi kesalahan");
      }
    } catch {
      setError("Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[250px] h-[250px] bg-purple-600/20 blur-2xl rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] bg-blue-600/20 blur-2xl rounded-full" />
      </div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl">

          {/* LEFT SIDE */}
          <div className="hidden lg:flex flex-col justify-center p-10 bg-gradient-to-br from-[#0A1024] to-[#090B18]">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-base font-bold">
                S
              </div>
              <div>
                <h1 className="text-lg font-bold">Go Study</h1>
                <p className="text-gray-400 text-xs">AI Learning Platform</p>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold leading-tight">
                Reset Your <br />
                <span className="text-purple-400">Password</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                No worries! Enter your email and we'll send you a link to reset your password.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-sm">

              <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-base font-bold">
                  S
                </div>
                <div>
                  <h1 className="text-lg font-bold">StudyAI</h1>
                  <p className="text-xs text-gray-400">AI Learning Platform</p>
                </div>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-6">
                <Mail size={20} className="text-purple-400" />
              </div>

              {sent ? (
                <div>
                  <h3 className="text-2xl font-bold mb-2">Email Terkirim!</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Kami sudah mengirim link reset password ke{" "}
                    <span className="text-white font-medium">{email}</span>.
                    Cek inbox atau folder spam kamu. Link berlaku selama <strong>1 jam</strong>.
                  </p>
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-sm hover:opacity-90 transition-all"
                  >
                    Kembali ke Login
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-bold mb-1">Lupa Password?</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Masukkan email kamu untuk mendapat link reset password.
                  </p>

                  {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1.5">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder="Enter your email"
                        className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-sm outline-none focus:border-purple-500 transition-all"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={loading || !email.trim()}
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {loading ? "Mengirim..." : "Kirim Link Reset"}
                    </button>
                  </div>

                  <p className="text-center text-gray-400 text-xs mt-6">
                    Ingat password kamu?{" "}
                    <Link href="/login" className="text-purple-400 hover:text-purple-300 transition">
                      Login
                    </Link>
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}