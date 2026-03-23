"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("E-mail ou senha incorretos.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Erro ao conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E] px-4">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00B4D8]/20 to-[#00E5A0]/20 border border-[#00B4D8]/30 mb-4">
            <svg
              viewBox="0 0 48 48"
              className="w-10 h-10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 8C24 8 18 6 10 8C10 8 8 8.5 8 11V34C8 35.5 9.5 36 10 36C18 34 24 36 24 36C24 36 30 34 38 36C38.5 36 40 35.5 40 34V11C40 8.5 38 8 38 8C30 6 24 8 24 8Z"
                stroke="#00B4D8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="rgba(0, 180, 216, 0.08)"
              />
              <path
                d="M24 8V36"
                stroke="#00B4D8"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="14" cy="16" r="2" fill="#00E5A0" />
              <circle cx="20" cy="20" r="1.5" fill="#00E5A0" />
              <circle cx="14" cy="26" r="1.5" fill="#00E5A0" />
              <circle cx="19" cy="30" r="1.5" fill="#00B4D8" />
              <circle cx="34" cy="16" r="2" fill="#00E5A0" />
              <circle cx="28" cy="20" r="1.5" fill="#00E5A0" />
              <circle cx="34" cy="26" r="1.5" fill="#00E5A0" />
              <circle cx="29" cy="30" r="1.5" fill="#00B4D8" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Instituto i10</h1>
          <p className="text-sm text-[#00B4D8]/80 mt-1">
            Projeto Educação do Futuro
          </p>
        </div>

        {/* Login card */}
        <div className="bg-[#0D1530]/80 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white mb-6 text-center">
            Entrar na plataforma
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/70 mb-1.5"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8]/50 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/70 mb-1.5"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8]/50 transition-all"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#00E5A0] text-[#030B1A] font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#030B1A]/30 border-t-[#030B1A] rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-white/30 mt-6">
          Acesso restrito — plataforma de uso interno
        </p>
        <p className="text-center text-[10px] text-white/20 mt-1">
          ETEC &middot; SED/SC &middot; Instituto i10
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E]">
          <div className="w-8 h-8 border-2 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
