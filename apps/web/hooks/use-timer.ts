"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (startTimeRef.current !== null) {
      setElapsedMs(Date.now() - startTimeRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const start = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now();
      setIsRunning(true);
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [isRunning, tick]);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsRunning(false);
    return elapsedMs;
  }, [elapsedMs]);

  const reset = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startTimeRef.current = null;
    setElapsedMs(0);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return { elapsedMs, isRunning, start, stop, reset };
}
