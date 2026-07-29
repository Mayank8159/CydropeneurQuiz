"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NeonButton } from "./neon-button";
import { Download, X } from "lucide-react";

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) return;

    if (window.innerWidth >= 1024) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setDeferredPrompt(null);
    localStorage.setItem("pwa-install-dismissed", "1");
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="glass glow-cyan w-full max-w-sm rounded-lg border border-neon-cyan/30 p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-neon-cyan">
                <Download size={20} />
                <h3 className="font-display text-sm font-bold uppercase tracking-widest">
                  Install App
                </h3>
              </div>
              <button
                onClick={handleDismiss}
                className="text-muted-steel transition-colors hover:text-ice-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mb-6 font-body text-sm text-muted-steel">
              Install CYDROPRENEUR on your device for quick access and a full-screen
              experience.
            </p>

            <div className="flex gap-3">
              <NeonButton
                variant="cyan"
                size="sm"
                onClick={handleInstall}
                className="flex-1"
              >
                <span className="flex items-center justify-center gap-2">
                  <Download size={14} />
                  Install
                </span>
              </NeonButton>
              <NeonButton
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
              >
                Dismiss
              </NeonButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
