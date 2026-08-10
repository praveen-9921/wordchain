import React, { useState } from 'react';
import { Play, Users, ArrowRight, Gamepad2, WifiOff } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export const HomeScreen = () => {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState('menu'); // 'menu' | 'join'
  const { createRoom, joinRoom, error, isConnected } = useSocket();

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim() || !isConnected) return;
    createRoom(name.trim());
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!name.trim() || !roomCode.trim() || !isConnected) return;
    joinRoom(roomCode.trim().toUpperCase(), name.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4">
      <div className="w-full max-w-md p-8 glass-card rounded-3xl animate-float">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-2xl bg-purple-600/20 border border-purple-500/30 mb-4 shadow-inner">
            <Gamepad2 className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Word Chain</h2>
          <p className="text-sm text-slate-400 mt-2">Connect words, outsmart opponents, climb the leaderboard.</p>
        </div>

        {/* 1. Connection Error Alert Banner */}
        {!isConnected && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-center gap-2 font-medium animate-pulse">
            <WifiOff className="w-4 h-4 flex-shrink-0" />
            <span>Unable to connect to the game server. Please wait...</span>
          </div>
        )}

        {/* Room/Validation Logic Error Alerts */}
        {error && isConnected && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Your Player Name
            </label>
            <input
              type="text"
              placeholder="e.g. WordMaster99"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isConnected}
              className="w-full px-4 py-3 rounded-xl glass-input text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
              maxLength={15}
            />
          </div>

          {mode === 'menu' ? (
            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* 2. Disabled states when isConnected is false */}
              <button
                onClick={handleCreate}
                disabled={!name.trim() || !isConnected}
                className="glass-button py-3.5 px-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Create Room</span>
              </button>
              <button
                onClick={() => setMode('join')}
                disabled={!name.trim() || !isConnected}
                className="py-3.5 px-4 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-semibold hover:bg-slate-700/80 transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
              >
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>Join Room</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Enter Room Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. X7K9P2"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  disabled={!isConnected}
                  className="w-full px-4 py-3 rounded-xl glass-input text-white uppercase tracking-widest text-center font-mono placeholder-slate-500 focus:outline-none focus:border-purple-500 transition disabled:opacity-40"
                  maxLength={6}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('menu')}
                  className="w-1/3 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 font-medium hover:bg-slate-700 transition text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || !roomCode.trim() || !isConnected}
                  className="w-2/3 glass-button py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 text-xs disabled:opacity-40"
                >
                  <span>Enter Game</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};