import React, { useState } from 'react';
import { Sparkles, LogOut, Shield, HelpCircle, Wifi, WifiOff, X, HelpCircle as HelpIcon } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export const Navbar = () => {
  const { gameState, leaveRoom, socket, isConnected } = useSocket();
  const [showHelp, setShowHelp] = useState(false);
  const me = gameState?.players.find((p) => p.id === socket?.id);

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-6 py-4 border-b glass-card border-slate-800">
        <div className="flex items-center justify-center max-w-7xl mx-auto relative">
          
          {/* Left / Status Section */}
          <div className="absolute left-0 flex items-center gap-2">
            {/* Live Connection Status Dot */}
            <div 
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-wider uppercase transition ${
                isConnected 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
              }`}
            >
              {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span className="hidden md:inline">{isConnected ? 'Connected' : 'Offline'}</span>
            </div>
          </div>

          {/* Centered Logo & Branding */}
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-lg shadow-purple-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-indigo-300 leading-none">
                ChainWord
              </h1>
              <p className="text-[10px] text-slate-400 mt-0.5">Real-Time Multiplayer</p>
            </div>
          </div>

          {/* Right Layout Context Items (Help button is now integrated here) */}
          <div className="absolute right-0 flex items-center space-x-2.5">
            {/* How to Play Guide Trigger (Moved to right) */}
            <button
              onClick={() => setShowHelp(true)}
              className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-300 transition"
              title="How to Play Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {gameState && (
              <>
                {me?.isHost && (
                  <span className="hidden lg:flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                    <Shield className="w-3 h-3" /> Host
                  </span>
                )}
                <div className="text-right hidden md:block">
                  <p className="text-[10px] text-slate-500">Playing as</p>
                  <p className="text-xs font-semibold text-purple-300">{me?.name || 'Guest'}</p>
                </div>
                <button
                  onClick={leaveRoom}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-medium transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Leave</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Modern Glassmorphic Help Guide Modal Overlay */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-opacity">
          <div className="w-full max-w-md p-6 glass-card rounded-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <HelpIcon className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-black text-white">How To Play</h3>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                <p className="font-bold text-white mb-1">⛓️ The Rule of the Chain</p>
                When a game starts, a random character is drawn. The active player must enter a valid dictionary word starting with that letter. The **last letter** of that word becomes the next player's starting criteria!
              </div>

              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                <p className="font-bold text-white mb-1">🏆 Scoring Parameters</p>
                * Successful valid submission: <span className="text-emerald-400 font-bold">+2 points</span>
                <br />
                * Typos, illegal characters, duplicates, or non-dictionary words: <span className="text-red-400 font-bold">-1 point</span>
              </div>

              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                <p className="font-bold text-white mb-1">⏱️ The Pass System & Sudden Death</p>
                Normally you have unlimited time. If you get completely stuck, click **Pass**. If **EVERY** player clicks pass during a round, an automatic **20-second sudden-death timer** triggers for the current player to wrap up!
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full glass-button py-2.5 rounded-xl text-white font-bold text-xs"
            >
              Got it, let's play!
            </button>
          </div>
        </div>
      )}
    </>
  );
};