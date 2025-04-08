import React from 'react';
import './index.css';
import NimGamePage from '../nimGamePage';
import useGamePage from '../../../../hooks/useGamePage';
import { GameInstance, NimGameState } from '../../../../types/types';

const GamePage = () => {
  const { gameInstance, error, handleLeaveGame } = useGamePage();

  const renderGameComponent = (gameType: string) => {
    if (!gameInstance) return null;

    switch (gameType) {
      case 'Nim':
        return (
          <NimGamePage
            gameInstance={gameInstance as GameInstance<NimGameState>}
            aria-labelledby='nim-game-details'
          />
        );
      default:
        return (
          <div role='alert' aria-live='assertive'>
            Unknown game type
          </div>
        );
    }
  };

  return (
    <main className='game-page' role='main' aria-labelledby='game-page-heading'>
      <header className='game-header' role='banner'>
        <h1 id='game-page-heading' aria-label={`${gameInstance?.gameType || 'Game'} Page`}>
          {gameInstance?.gameType || 'Game'} Game
        </h1>

        <p className='game-status' aria-live='polite'>
          Status: {gameInstance ? gameInstance.state.status : 'Not started'}
        </p>
      </header>

      <div className='game-controls' role='toolbar'>
        <button
          className='btn-leave-game'
          onClick={handleLeaveGame}
          aria-label='Leave Current Game'>
          Leave Game
        </button>
      </div>

      {gameInstance && renderGameComponent(gameInstance.gameType)}

      {error && (
        <div className='game-error' role='alert' aria-live='assertive'>
          {error}
        </div>
      )}
    </main>
  );
};

export default GamePage;
