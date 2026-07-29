"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { NeonInput } from "@/components/ui/neon-input";
import { checkPlayerName } from "@/lib/api";

const EVENT_PASSKEY = process.env.NEXT_PUBLIC_EVENT_PASSKEY || "";

export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

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

    await new Promise((r) => setTimeout(r, 800));

    if (passkey !== EVENT_PASSKEY) {
      setError("ACCESS DENIED // INVALID CLEARANCE");
      setLoading(false);
      return;
    }

    try {
      const { exists } = await checkPlayerName(playerName);
      if (exists) {
        setError("CALLSIGN TAKEN // ANOTHER OPERATIVE HAS THIS IDENTITY");
        setLoading(false);
        return;
      }
    } catch {
      setError("SERVER NOT CONNECTED // UNABLE TO VERIFY IDENTITY");
      setLoading(false);
      return;
    }

    sessionStorage.setItem("playerName", playerName.trim().toLowerCase());
    router.push("/quiz");
  };

  return (
    <div className="flex min-h-dvh items-center md:items-start justify-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-[400px] space-y-6 my-auto md:my-0 md:mt-[44vh] lg:mt-[48vh] xl:mt-[50vh] pb-8">

        {/* Glassmorphism Card Container */}
        <div
          className="flex flex-col w-full rounded-2xl p-5 sm:p-6 shadow-2xl border-2 border-white/30 text-white bg-white/[0.12] backdrop-blur-2xl shadow-[0_0_40px_rgba(255,255,255,0.12)] justify-center"
        >
          {/* Title */}
          <h2 className="text-base sm:text-lg text-center font-display font-normal tracking-wide uppercase text-white mb-6">
            SIGN UP FOR QUIZ
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 sm:gap-5">
            <NeonInput
              label="Player Name"
              placeholder="Enter your callsign..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
              labelClassName="text-white/90 font-normal text-[10px] tracking-normal"
              className="bg-black/40 border-white/25 text-white placeholder:text-white/40 focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.25)] text-sm"
            />

            <NeonInput
              label="Access Passkey"
              type="password"
              placeholder="Enter passkey..."
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              required
              labelClassName="text-white/90 font-normal text-[10px] tracking-normal"
              className="bg-black/40 border-white/25 text-white placeholder:text-white/40 focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.25)] text-sm"
            />

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="animate-glitch overflow-hidden rounded-md border border-white/20 bg-white/5 px-4 py-3 text-center"
                >
                  <span className="font-display text-xs font-normal tracking-normal text-white">
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
              className="w-full mt-2 font-display font-normal uppercase tracking-normal border-2 border-white text-white bg-transparent h-11 rounded-md transition-all duration-300 hover:bg-white/10 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed text-center flex items-center justify-center text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2 text-xs">
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </span>
              ) : (
                "Start the Quiz"
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-2">
          <a
            href="/admin"
            className="inline-block rounded-full bg-black/80 border border-white/50 px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(0,0,0,0.9)] backdrop-blur-md transition-all duration-300 hover:border-neon-pink hover:text-neon-pink hover:shadow-[0_0_20px_rgba(255,0,128,0.5)]"
          >
            Admin Terminal
          </a>
        </div>

      </div>
    </div>
  );
}
