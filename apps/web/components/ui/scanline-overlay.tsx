"use client";

export function ScanlineOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div
        className="animate-scanline absolute inset-0 opacity-[0.03]"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 243, 255, 0.1) 2px, rgba(0, 243, 255, 0.1) 4px)",
        }}
      />
    </div>
  );
}
