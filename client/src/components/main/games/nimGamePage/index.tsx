import React from 'react';
import './index.css';
import { GameInstance, NimGameState } from '../../../../types/types';
import useNimGamePage from '../../../../hooks/useNimGamePage';

const NimGamePage = ({ gameInstance }: { gameInstance: GameInstance<NimGameState> }) => {
  const { user, move, handleMakeMove, handleInputChange } = useNimGamePage(gameInstance);

  return (
    <div className='nim-game-container' role='region' aria-labelledby='nim-game-details'>
      <section className='nim-rules' aria-labelledby='nim-rules-heading'>
        <h2 id='nim-rules-heading'>Rules of Nim</h2>
        <ol aria-label='Nim Game Rules'>
          <li>The game starts with a pile of objects.</li>
          <li>Players take turns removing objects from the pile.</li>
          <li>On their turn, a player must remove 1, 2, or 3 objects from the pile.</li>
          <li>The player who removes the last object loses the game.</li>
        </ol>
        <p>Think strategically and try to force your opponent into a losing position!</p>
      </section>

      <section className='nim-game-details' aria-labelledby='current-game-heading'>
        <h2 id='current-game-heading'>Current Game</h2>

        <div role='list' aria-label='Game Players and Status'>
          <div role='listitem'>
            <strong>Player 1:</strong> {gameInstance.state.player1 || 'Waiting...'}
          </div>
          <div role='listitem'>
            <strong>Player 2:</strong> {gameInstance.state.player2 || 'Waiting...'}
          </div>
          <div role='listitem'>
            <strong>Current Player to Move:</strong>{' '}
            {gameInstance.players[gameInstance.state.moves.length % 2]}
          </div>
          <div role='listitem'>
            <strong>Remaining Objects:</strong> {gameInstance.state.remainingObjects}
          </div>
        </div>

        {gameInstance.state.status === 'OVER' && (
          <div role='status' aria-live='polite'>
            <strong>Winner:</strong> {gameInstance.state.winners?.join(', ') || 'No winner'}
          </div>
        )}

        {gameInstance.state.status === 'IN_PROGRESS' && (
          <div className='nim-game-move' role='form' aria-labelledby='make-move-heading'>
            <h3 id='make-move-heading'>Make Your Move</h3>
            <label htmlFor='move-input' className='sr-only'>
              Enter number of objects to remove (1-3)
            </label>
            <input
              id='move-input'
              type='number'
              className='input-move'
              value={move}
              onChange={handleInputChange}
              min='1'
              max='3'
              placeholder='Enter 1-3'
              aria-describedby='move-instructions'
            />
            <p id='move-instructions' className='sr-only'>
              Choose to remove 1, 2, or 3 objects from the pile
            </p>
            <button
              className='btn-submit'
              onClick={handleMakeMove}
              disabled={gameInstance.players[gameInstance.state.moves.length % 2] !== user.username}
              aria-label='Submit Move'>
              Submit Move
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default NimGamePage;
