"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { NeonInput } from "@/components/ui/neon-input";
import { adminLogin } from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      setError("");
    }, 2000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await adminLogin({ username, passkey });
      if (res.success) {
        sessionStorage.setItem("adminAuth", passkey);
        sessionStorage.setItem("adminUsername", res.username || username);
        router.push("/admin/dashboard");
      } else {
        setError(res.message || "ACCESS DENIED // ADMIN CLEARANCE REQUIRED");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || "ACCESS DENIED // INVALID CREDENTIALS OR DB CHECK FAILED");
      setLoading(false);
    }
  };

  return (
    <div suppressHydrationWarning className="flex min-h-dvh items-end sm:items-center justify-center px-4 pt-32 pb-8 sm:pt-48 sm:pb-12 overflow-y-auto">
      <div suppressHydrationWarning className="w-full max-w-[320px] sm:max-w-[340px] space-y-4 mt-36 sm:mt-52 md:mt-60 mb-4">

        {/* Glassmorphism Card Container */}
        <div
          className="flex flex-col w-full rounded-2xl p-4 sm:p-5 shadow-2xl border-2 border-white/30 text-white bg-white/[0.12] backdrop-blur-2xl shadow-[0_0_40px_rgba(255,255,255,0.12)] justify-center"
        >
          {/* Title */}
          <h2 className="text-xs sm:text-sm text-center font-display font-normal tracking-wide uppercase text-white mb-4">
            ADMIN TERMINAL
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-3 sm:gap-3.5">
            <NeonInput
              label="Admin Username"
              type="text"
              placeholder="Enter admin username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              labelClassName="text-white/90 font-normal text-[9px] tracking-normal mb-1"
              className="bg-black/40 border-white/25 text-white placeholder:text-white/40 focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.25)] text-xs h-9"
            />

            <NeonInput
              label="Admin Passkey"
              type="password"
              placeholder="Enter admin passkey..."
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              required
              showPasswordToggle
              labelClassName="text-white/90 font-normal text-[9px] tracking-normal mb-1"
              className="bg-black/40 border-white/25 text-white placeholder:text-white/40 focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.25)] text-xs h-9"
            />

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="animate-glitch overflow-hidden rounded-md border border-white/20 bg-white/5 px-3 py-2 text-center"
                >
                  <span className="font-display text-[10px] font-normal tracking-normal text-white">
                    {error}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
              className="w-full mt-1 font-display font-normal uppercase tracking-normal border-2 border-white text-white bg-transparent h-9.5 rounded-md transition-all duration-300 hover:bg-white/10 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed text-center flex items-center justify-center text-xs"
            >
              {loading ? (
                <span className="flex items-center gap-2 text-[10px]">
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </span>
              ) : (
                "Authenticate"
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-1.5">
          <a
            href="/"
            className="inline-block rounded-full bg-black/80 border border-white/50 px-4 py-2 font-display text-[10px] font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(0,0,0,0.9)] backdrop-blur-md transition-all duration-300 hover:border-neon-cyan hover:text-neon-cyan hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]"
          >
            Back to Main Terminal
          </a>
        </div>
      </div>
    </div>
  );
}
