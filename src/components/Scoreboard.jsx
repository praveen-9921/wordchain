import React from 'react';
import { Award, SkipForward, CheckCircle2 } from 'lucide-react';

export const Scoreboard = ({ players, currentTurnPlayerId, passStatuses }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="glass-card rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
        <Award className="w-5 h-5 text-amber-400" />
        <h3 className="font-bold text-white text-base">Live Leaderboard</h3>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-1">
        {sortedPlayers.map((player, idx) => {
          const isTurn = player.id === currentTurnPlayerId;
          const hasPassed = passStatuses?.[player.id];

          return (
            <div
              key={player.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                isTurn
                  ? 'bg-purple-600/20 border-purple-500/60 shadow-lg shadow-purple-900/20'
                  : 'bg-slate-900/40 border-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                  idx === 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {idx + 1}
                </span>

                <div>
                  <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                    {player.name}
                    {isTurn && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Current Turn" />
                    )}
                  </p>
                  <p className="text-xs text-slate-400">{player.score} pts</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {hasPassed ? (
                  <span className="text-[10px] font-semibold px-2 py-1 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center gap-1">
                    <SkipForward className="w-3 h-3" /> Passed
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Active</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};