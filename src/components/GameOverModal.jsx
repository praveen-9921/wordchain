import React, { useEffect } from 'react';
import { Trophy, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSocket } from '../context/SocketContext';

export const GameOverModal = () => {
  const { gameState, leaveRoom } = useSocket();

  useEffect(() => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }, []);

  const sorted = [...gameState.players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg p-8 glass-card rounded-3xl text-center space-y-6 animate-float">
        <div className="inline-block p-4 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
          <Trophy className="w-12 h-12" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-purple-400 tracking-widest">Match Finished</span>
          <h2 className="text-3xl font-black text-white mt-1">{winner?.name} Wins!</h2>
          <p className="text-sm text-slate-400 mt-1">Top score of {winner?.score} points</p>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {sorted.map((player, idx) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-sm"
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx === 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  #{idx + 1}
                </span>
                <span className="font-semibold text-white">{player.name}</span>
              </div>
              <span className="font-mono text-purple-300 font-bold">{player.score} pts</span>
            </div>
          ))}
        </div>

        <button
          onClick={leaveRoom}
          className="w-full glass-button py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};