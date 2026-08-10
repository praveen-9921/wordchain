import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false); // <-- New State
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [lastTurnFeedback, setLastTurnFeedback] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);

    // Track real-time connection status
    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));

    newSocket.on('game_state_update', (updatedState) => {
      setGameState(updatedState);
      setError('');
    });

    newSocket.on('chat_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('word_submitted_feedback', (feedback) => {
      setLastTurnFeedback(feedback);
      setTimeout(() => setLastTurnFeedback(null), 3000);
    });

    newSocket.on('error_message', (msg) => {
      setError(msg);
      setTimeout(() => setError(''), 4000);
    });

    return () => newSocket.close();
  }, []);

  const createRoom = (playerName) => {
    if (socket) socket.emit('create_room', { playerName });
  };

  const joinRoom = (roomCode, playerName) => {
    if (socket) socket.emit('join_room', { roomCode, playerName });
  };

  const startGame = () => {
    if (socket && gameState) socket.emit('start_game', { roomCode: gameState.roomCode });
  };

  const submitWord = (word) => {
    if (socket && gameState) socket.emit('submit_word', { roomCode: gameState.roomCode, word });
  };

  const pressPass = () => {
    if (socket && gameState) socket.emit('press_pass', { roomCode: gameState.roomCode });
  };

  const sendChatMessage = (text) => {
    if (socket && gameState) socket.emit('send_chat', { roomCode: gameState.roomCode, text });
  };

  const leaveRoom = () => {
    if (socket && gameState) {
      socket.emit('leave_room', { roomCode: gameState.roomCode });
      setGameState(null);
      setMessages([]);
    }
  };

  const endGame = () => {
    if (socket && gameState) socket.emit('end_game', { roomCode: gameState.roomCode });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected, // <-- Exposed here
        gameState,
        error,
        messages,
        lastTurnFeedback,
        createRoom,
        joinRoom,
        startGame,
        submitWord,
        pressPass,
        sendChatMessage,
        leaveRoom,
        endGame,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};