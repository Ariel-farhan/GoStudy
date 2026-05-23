'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email atau password salah");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-purple-600/20 blur-2xl rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-600/20 blur-2xl rounded-full" />
      </div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl">

          {/* LEFT SIDE DESKTOP */}
          <div className="hidden lg:flex flex-col justify-center p-14 bg-gradient-to-br from-[#0A1024] to-[#090B18]">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold">
                S
              </div>
              <div>
                <h1 className="text-2xl font-bold">Go Study</h1>
                <p className="text-gray-400 text-sm">AI Learning Platform</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-5xl font-bold leading-tight">
                Smart Learning <br />
                Starts{" "}
                <span className="text-purple-400">Here</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Upload your study materials, summarize PDFs with AI,
                and learn smarter with your own intelligent workspace.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-md">

              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold">
                  S
                </div>
                <div>
                  <h1 className="text-2xl font-bold">StudyAI</h1>
                  <p className="text-sm text-gray-400">AI Learning Platform</p>
                </div>
              </div>

              {/* Form Header */}
              <div className="mb-8 text-center lg:text-left">
                <h3 className="text-4xl font-bold mb-2">Welcome Back</h3>
                <p className="text-gray-400">Login to continue your learning journey</p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Form */}
              <div className="space-y-5">

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="Enter your email"
                    className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      placeholder="Enter your password"
                      className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 px-5 pr-14 outline-none focus:border-purple-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-3 text-gray-400 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-purple-500" />
                    Remember me
                  </label>
                  <button type="button" className="text-purple-400 hover:text-purple-300 transition">
                    Forgot password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 text-gray-500 text-sm my-8">
                <div className="flex-1 h-px bg-white/10" />
                or continue with
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Social Login */}
              <div className="space-y-4">
                <button
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-3 font-medium"
                >
                  <FcGoogle size={22} />
                  Continue with Google
                </button>

                <button
                  onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                  className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-3 font-medium"
                >
                  <FaGithub size={22} />
                  Continue with GitHub
                </button>
              </div>

              {/* Register */}
              <p className="text-center text-gray-400 text-sm mt-8">
                Don&apos;t have an account?{" "}
                <span
                  onClick={() => router.push("/register")}
                  className="text-purple-400 cursor-pointer hover:text-purple-300"
                >
                  Create account
                </span>
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}