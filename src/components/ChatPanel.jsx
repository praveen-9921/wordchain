import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export const ChatPanel = () => {
  const { messages, sendChatMessage, socket } = useSocket();
  const [input, setInput] = useState('');
  const chatBottomRef = useRef(null);

  // Auto-scroll to the latest message inside the box
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendChatMessage(input.trim());
    setInput('');
  };

  return (
    /* Locked fixed height with shrink prevention so it won't force the parent screen to stretch */
    <div className="glass-card rounded-2xl p-4 h-[280px] flex flex-col shrink-0 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 pb-2.5 border-b border-slate-800 shrink-0">
        <MessageSquare className="w-4 h-4 text-indigo-400" />
        <h3 className="font-bold text-white text-xs uppercase tracking-wider">Room Chat</h3>
      </div>

      {/* Internal Scrollable Message Area */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-2 text-xs scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === socket?.id;
          const isSystem = msg.isSystem;

          if (isSystem) {
            return (
              <div key={idx} className="text-center py-1 text-slate-400 italic text-[11px] bg-slate-900/40 rounded-lg my-1">
                {msg.text}
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-slate-400 mb-0.5 px-1">{msg.senderName}</span>
              <div
                className={`max-w-[85%] px-3 py-1.5 rounded-xl text-white break-words ${
                  isMe
                    ? 'bg-purple-600/80 border border-purple-500/30'
                    : 'bg-slate-800/80 border border-slate-700/80'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="flex gap-2 shrink-0 pt-1">
        <input
          type="text"
          placeholder="Send a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl glass-input text-white text-xs focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2 rounded-xl glass-button text-white disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};