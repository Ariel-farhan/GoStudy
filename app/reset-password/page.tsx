'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) router.push("/forgot-password");
  }, [token, router]);

  const handleSubmit = async () => {
    if (!password || !confirm) return;
    if (password !== confirm) {
      setError("Password tidak cocok");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
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
                Create New <br />
                <span className="text-purple-400">Password</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Choose a strong password to keep your account secure.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-sm">

              {/* Mobile Logo */}
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
                <KeyRound size={20} className="text-purple-400" />
              </div>

              {success ? (
                <div>
                  <h3 className="text-2xl font-bold mb-2">Password Berhasil Direset!</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Password kamu sudah diperbarui. Kamu akan diarahkan ke halaman login dalam beberapa detik.
                  </p>
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-sm hover:opacity-90 transition-all"
                  >
                    Login Sekarang
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-bold mb-1">Buat Password Baru</h3>
                  <p className="text-gray-400 text-sm mb-6">Minimal 8 karakter.</p>

                  {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1.5">Password Baru</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Minimal 8 karakter"
                          className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 pr-11 text-sm outline-none focus:border-purple-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1.5">Konfirmasi Password</label>
                      <div className="relative">
                        <input
                          type={showConfirm ? "text" : "password"}
                          value={confirm}
                          onChange={(e) => setConfirm(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                          placeholder="Ulangi password baru"
                          className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 pr-11 text-sm outline-none focus:border-purple-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                        >
                          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={loading || !password || !confirm}
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {loading ? "Menyimpan..." : "Simpan Password Baru"}
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