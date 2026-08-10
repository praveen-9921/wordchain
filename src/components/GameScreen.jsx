import React, { useState } from 'react';
import { Send, SkipForward, Clock, AlertCircle, StopCircle } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { Scoreboard } from './Scoreboard';
import { ChatPanel } from './ChatPanel';

export const GameScreen = () => {
  const { gameState, submitWord, pressPass, socket, lastTurnFeedback, endGame } = useSocket();
  const [word, setWord] = useState('');

  const currentTurnPlayer = gameState.players.find((p) => p.id === gameState.currentTurnPlayerId);
  const isMyTurn = gameState.currentTurnPlayerId === socket?.id;
  const me = gameState.players.find((p) => p.id === socket?.id);
  const myPassStatus = gameState.passStatuses?.[socket?.id];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!word.trim() || !isMyTurn) return;
    submitWord(word.trim());
    setWord('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Gameplay Column */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Status Header Banner */}
          <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Current Turn</p>
              <h2 className="text-2xl font-black text-white flex items-center gap-2 mt-1">
                <span className={isMyTurn ? "text-purple-400" : "text-white"}>
                  {isMyTurn ? "Your Turn!" : `${currentTurnPlayer?.name}'s Turn`}
                </span>
              </h2>
            </div>

            {/* Required Letter Highlight */}
            <div className="flex items-center gap-4 bg-slate-900/80 px-6 py-3 rounded-2xl border border-slate-800">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Must Start With</p>
                <p className="text-xs text-slate-400">Previous Letter</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-lg animate-pulse-glow">
                {gameState.currentLetter}
              </div>
            </div>
          </div>

          {/* Word Input & Feedback Box */}
          <div className="glass-card rounded-3xl p-8 text-center space-y-6 relative overflow-hidden">
            
            {/* Pass Countdown Timer Overlay */}
            {gameState.timerActive && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold animate-pulse">
                <Clock className="w-4 h-4" />
                <span>All Passed! Sudden Death: {gameState.timeLeft}s remaining</span>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Enter word starting with '${gameState.currentLetter}'...`}
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  disabled={!isMyTurn}
                  className="w-full px-6 py-5 text-xl font-semibold rounded-2xl glass-input text-white text-center placeholder-slate-500 focus:outline-none focus:border-purple-500 disabled:opacity-50 transition"
                  autoFocus
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-purple-400">
                  {gameState.currentLetter}
                </span>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="submit"
                  disabled={!isMyTurn || !word.trim()}
                  className="glass-button px-8 py-3.5 rounded-xl text-white font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit (+2 pts)</span>
                </button>

                <button
                  type="button"
                  onClick={pressPass}
                  disabled={myPassStatus}
                  className={`px-6 py-3.5 rounded-xl border text-sm font-bold flex items-center gap-2 transition ${
                    myPassStatus
                      ? 'bg-slate-800/50 border-slate-700/50 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
                  }`}
                >
                  <SkipForward className="w-4 h-4" />
                  <span>{myPassStatus ? 'Passed' : 'Pass Turn'}</span>
                </button>
              </div>
            </form>

            {/* Feedback Notifications */}
            {lastTurnFeedback && (
              <div
                className={`p-3 rounded-xl max-w-md mx-auto text-sm font-semibold flex items-center justify-center gap-2 ${
                  lastTurnFeedback.valid
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>{lastTurnFeedback.message}</span>
              </div>
            )}

            {/* History Chain */}
            <div className="pt-4 border-t border-slate-800/80">
              <p className="text-xs text-slate-400 font-semibold mb-2">Word History</p>
              <div className="flex flex-wrap justify-center gap-2 max-h-24 overflow-y-auto">
                {gameState.history.map((h, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300"
                  >
                    {h.word} <span className="text-slate-500">({h.playerName})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Host Controls */}
          {me?.isHost && (
            <div className="flex justify-end">
              <button
                onClick={endGame}
                className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-semibold flex items-center gap-2 transition"
              >
                <StopCircle className="w-4 h-4" />
                <span>End Game (Host)</span>
              </button>
            </div>
          )}
        </div>

        {/* Sidebar: Scoreboard & Chat */}
        <div className="space-y-6 flex flex-col justify-between">
          <Scoreboard
            players={gameState.players}
            currentTurnPlayerId={gameState.currentTurnPlayerId}
            passStatuses={gameState.passStatuses}
          />
          <ChatPanel />
        </div>
      </div>
    </div>
  );
};