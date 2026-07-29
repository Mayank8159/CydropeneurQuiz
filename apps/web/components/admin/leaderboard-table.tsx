"use client";

interface LeaderboardTableProps {
  entries: Array<{
    rank: number;
    playerName: string;
    score: number;
    timeElapsedMs: number;
    submittedAt: string;
  }>;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor(ms % 1000);
  return `${minutes} mins: ${seconds} secs: ${milliseconds} millisecs`;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="py-12 text-center font-display text-muted-steel">
        No submissions yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-2 px-2">
      {/* Desktop table */}
      <table className="hidden w-full border-collapse sm:table">
        <thead>
          <tr className="border-b border-neon-cyan/20">
            <th className="px-3 py-2.5 text-left font-display text-[10px] uppercase tracking-widest text-neon-cyan sm:px-4 sm:py-3 sm:text-xs">
              Rank
            </th>
            <th className="px-3 py-2.5 text-left font-display text-[10px] uppercase tracking-widest text-neon-cyan sm:px-4 sm:py-3 sm:text-xs">
              Player
            </th>
            <th className="px-3 py-2.5 text-right font-display text-[10px] uppercase tracking-widest text-neon-cyan sm:px-4 sm:py-3 sm:text-xs">
              Score
            </th>
            <th className="px-3 py-2.5 text-right font-display text-[10px] uppercase tracking-widest text-neon-cyan sm:px-4 sm:py-3 sm:text-xs">
              Time
            </th>
            <th className="px-3 py-2.5 text-right font-display text-[10px] uppercase tracking-widest text-neon-cyan sm:px-4 sm:py-3 sm:text-xs">
              Submitted
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.rank}
              className="border-b border-muted-steel/10 transition-colors hover:bg-neon-cyan/5"
            >
              <td className="px-3 py-2.5 font-display text-xs font-bold text-neon-cyan sm:px-4 sm:py-3">
                #{entry.rank}
              </td>
              <td className="px-3 py-2.5 font-body text-sm text-ice-white sm:px-4 sm:py-3">
                {entry.playerName}
              </td>
              <td className="px-3 py-2.5 text-right font-display text-sm font-bold text-neon-pink sm:px-4 sm:py-3">
                {entry.score}
              </td>
              <td className="px-3 py-2.5 text-right font-display text-xs text-muted-steel sm:px-4 sm:py-3">
                {formatTime(entry.timeElapsedMs)}
              </td>
              <td className="px-3 py-2.5 text-right font-body text-xs text-muted-steel sm:px-4 sm:py-3">
                {formatTimestamp(entry.submittedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {entries.map((entry) => (
          <div
            key={entry.rank}
            className="rounded-lg border border-white/20 bg-white/[0.08] p-3 backdrop-blur-md"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-display text-sm font-bold text-neon-cyan">
                #{entry.rank}
              </span>
              <span className="font-display text-lg font-bold text-neon-pink">
                {entry.score} pts
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-body text-ice-white">
                {entry.playerName}
              </span>
              <span className="font-display text-xs text-muted-steel">
                {formatTime(entry.timeElapsedMs)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
