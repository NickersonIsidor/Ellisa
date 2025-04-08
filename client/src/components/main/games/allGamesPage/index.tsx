import React from 'react';
import './index.css';
import useAllGamesPage from '../../../../hooks/useAllGamesPage';
import GameCard from './gameCard';

const AllGamesPage = () => {
  const {
    availableGames,
    handleJoin,
    fetchGames,
    isModalOpen,
    handleToggleModal,
    handleSelectGameType,
    error,
  } = useAllGamesPage();

  return (
    <main className='game-page' role='main' aria-labelledby='games-heading'>
      <div className='game-controls'>
        <button
          className='btn-create-game'
          onClick={handleToggleModal}
          aria-label='Open Game Creation Modal'>
          Create Game
        </button>
      </div>

      {isModalOpen && (
        <div className='game-modal' role='dialog' aria-labelledby='game-type-selection'>
          <div className='modal-content'>
            <h2 id='game-type-selection'>Select Game Type</h2>
            <div className='game-type-buttons'>
              <button onClick={() => handleSelectGameType('Nim')} aria-label='Create a Nim Game'>
                Nim
              </button>
              <button onClick={handleToggleModal} aria-label='Cancel Game Creation'>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <section className='game-available' aria-labelledby='available-games-heading'>
        <div className='game-list'>
          {error && (
            <div className='game-error' role='alert' aria-live='assertive'>
              {error}
            </div>
          )}

          <h2 id='available-games-heading'>Available Games</h2>

          <button
            className='btn-refresh-list'
            onClick={fetchGames}
            aria-label='Refresh List of Available Games'>
            Refresh List
          </button>

          <div className='game-items' role='list' aria-label='List of Available Games'>
            {availableGames.length === 0 ? (
              <p role='status' aria-live='polite'>
                No games are currently available
              </p>
            ) : (
              availableGames.map((game, index) => (
                <div
                  role='listitem'
                  key={game.gameID}
                  aria-posinset={index + 1}
                  aria-setsize={availableGames.length}>
                  <GameCard game={game} handleJoin={handleJoin} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AllGamesPage;
