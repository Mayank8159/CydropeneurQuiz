"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { GlitchText } from "@/components/ui/glitch-text";
import { NeonInput } from "@/components/ui/neon-input";
import { NeonButton } from "@/components/ui/neon-button";
import { CyberCard } from "@/components/ui/cyber-card";
import { Shield, Zap } from "lucide-react";

const EVENT_PASSKEY = "Secure@123";

export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    sessionStorage.setItem("playerName", playerName);
    router.push("/quiz");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <GlitchText
            text="CYDROPENEUR"
            className="text-4xl font-bold tracking-wider text-neon-cyan text-glow-cyan md:text-5xl"
          />
          <p className="mt-2 font-display text-sm uppercase tracking-[0.3em] text-muted-steel">
            Cyberpunk Quiz Arena
          </p>
        </div>

        <CyberCard glow="cyan">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-neon-cyan">
              <Shield size={18} />
              <span className="font-display text-xs uppercase tracking-widest">
                Identity Verification
              </span>
            </div>

            <NeonInput
              label="Player Name"
              placeholder="Enter your callsign..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
            />

            <NeonInput
              label="Access Passkey"
              type="password"
              placeholder="Enter passkey..."
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              required
            />

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="animate-glitch overflow-hidden rounded-md border border-neon-pink/40 bg-neon-pink/10 px-4 py-3 text-center"
                >
                  <span className="font-display text-sm font-bold tracking-wider text-neon-pink">
                    {error}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <NeonButton
              type="submit"
              variant="cyan"
              size="lg"
              loading={loading}
              className="w-full"
            >
              <span className="flex items-center justify-center gap-2">
                <Zap size={18} />
                Initialize Session
              </span>
            </NeonButton>
          </form>
        </CyberCard>

        <div className="text-center">
          <a
            href="/admin"
            className="font-display text-xs uppercase tracking-widest text-muted-steel/50 transition-colors hover:text-neon-pink"
          >
            Admin Terminal
          </a>
        </div>
      </div>
    </div>
  );
}
