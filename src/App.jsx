import React from 'react';
import { SocketProvider, useSocket } from './context/SocketContext';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverModal } from './components/GameOverModal';

const MainLayout = () => {
  const { gameState } = useSocket();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {!gameState && <HomeScreen />}
        {gameState?.status === 'LOBBY' && <LobbyScreen />}
        {gameState?.status === 'PLAYING' && <GameScreen />}
        {gameState?.status === 'ENDED' && <GameOverModal />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <SocketProvider>
      <MainLayout />
    </SocketProvider>
  );
}