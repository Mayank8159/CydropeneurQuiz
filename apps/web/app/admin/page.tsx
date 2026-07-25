"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { GlitchText } from "@/components/ui/glitch-text";
import { CyberCard } from "@/components/ui/cyber-card";
import { NeonInput } from "@/components/ui/neon-input";
import { NeonButton } from "@/components/ui/neon-button";
import { Lock } from "lucide-react";

const ADMIN_PASSKEY = "Admin@15";

export default function AdminPage() {
  const router = useRouter();
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    if (passkey !== ADMIN_PASSKEY) {
      setError("ACCESS DENIED // ADMIN CLEARANCE REQUIRED");
      setLoading(false);
      return;
    }

    sessionStorage.setItem("adminAuth", passkey);
    router.push("/admin/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <GlitchText
            text="ADMIN TERMINAL"
            className="text-3xl font-bold tracking-wider text-neon-pink text-glow-pink md:text-4xl"
          />
          <p className="mt-2 font-display text-sm uppercase tracking-[0.2em] text-muted-steel">
            Restricted Access
          </p>
        </div>

        <CyberCard glow="pink">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-neon-pink">
              <Lock size={18} />
              <span className="font-display text-xs uppercase tracking-widest">
                Admin Authentication
              </span>
            </div>

            <NeonInput
              label="Admin Passkey"
              type="password"
              placeholder="Enter admin passkey..."
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
              variant="pink"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Authenticate
            </NeonButton>
          </form>
        </CyberCard>

        <div className="text-center">
          <a
            href="/"
            className="font-display text-xs uppercase tracking-widest text-muted-steel/50 transition-colors hover:text-neon-cyan"
          >
            Back to Main Terminal
          </a>
        </div>
      </div>
    </div>
  );
}
