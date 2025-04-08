import React from 'react';
import { useNavigate } from 'react-router-dom';
import useHeader from '../../hooks/useHeader';
import './index.css';
import useUserContext from '../../hooks/useUserContext';

const Header = () => {
  const { val, handleInputChange, handleKeyDown, handleSignOut } = useHeader();
  const { user: currentUser } = useUserContext();
  const navigate = useNavigate();

  return (
    <header id='header' className='header' role='banner'>
      <div className='header-container'>
        <h1 className='title' aria-label='Fake Stack Overflow Application'>
          Fake Stack Overflow
        </h1>

        <div className='search-container'>
          <label htmlFor='searchBar' className='sr-only'>
            Search Questions
          </label>
          <input
            id='searchBar'
            name='searchBar'
            placeholder='Search ...'
            type='text'
            value={val}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            aria-label='Search input for questions'
            aria-describedby='search-instructions'
          />
          <p id='search-instructions' className='sr-only'>
            Press Enter to search through questions
          </p>
        </div>

        <div className='header-actions'>
          <button
            onClick={handleSignOut}
            className='logout-button'
            aria-label='Sign out of the application'>
            Log out
          </button>

          <button
            className='view-profile-button'
            onClick={() => navigate(`/user/${currentUser.username}`)}
            aria-label={`View ${currentUser.username}'s profile`}>
            View Profile
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
