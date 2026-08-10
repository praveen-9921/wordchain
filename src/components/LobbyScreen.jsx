import React, { useState } from 'react';
import { Copy, Check, Shield, Users, Play, Crown } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export const LobbyScreen = () => {
  const { gameState, startGame, socket, error } = useSocket();
  const [copied, setCopied] = useState(false);

  const me = gameState?.players.find((p) => p.id === socket?.id);
  const isHost = me?.isHost;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gameState.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="glass-card rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase tracking-widest text-purple-400 font-bold">Lobby Phase</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Waiting for Players</h2>
            <p className="text-sm text-slate-400 mt-1">Minimum 2 players required to begin the chain.</p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="px-3">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Room Code</p>
              <p className="text-2xl font-mono font-bold tracking-widest text-purple-300">{gameState.roomCode}</p>
            </div>
            <button
              onClick={handleCopyCode}
              className="p-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 transition"
              title="Copy Code"
            >
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <div className="my-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Players Connected ({gameState.players.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {gameState.players.map((player) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition ${
                  player.id === socket?.id
                    ? 'bg-purple-900/20 border-purple-500/50'
                    : 'bg-slate-900/40 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                      {player.name}
                      {player.id === socket?.id && <span className="text-xs text-purple-400">(You)</span>}
                    </p>
                    <p className="text-xs text-slate-500">Ready</p>
                  </div>
                </div>

                {player.isHost && (
                  <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Crown className="w-4 h-4" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex justify-end">
          {isHost ? (
            <button
              onClick={startGame}
              disabled={gameState.players.length < 2}
              className="glass-button px-8 py-4 rounded-2xl text-white font-bold flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Game</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              Waiting for host to start...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};