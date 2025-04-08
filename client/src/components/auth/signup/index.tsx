import React from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

const Signup = () => {
  const {
    username,
    password,
    passwordConfirmation,
    showPassword,
    err,
    handleSubmit,
    handleInputChange,
    togglePasswordVisibility,
  } = useAuth('signup');

  return (
    <div className='container' role='main' aria-labelledby='signup-heading'>
      <h2 id='signup-heading'>Sign up for FakeStackOverflow!</h2>

      {err && (
        <div role='alert' aria-live='assertive' className='error-message'>
          {err}
        </div>
      )}

      <form onSubmit={handleSubmit} aria-describedby='signup-instructions'>
        <div id='signup-instructions' className='sr-only'>
          Fill out the form to create a new account
        </div>

        <div>
          <label htmlFor='username-input' className='input-label'>
            Username
          </label>
          <input
            type='text'
            id='username-input'
            value={username}
            onChange={event => handleInputChange(event, 'username')}
            placeholder='Enter your username'
            required
            aria-required='true'
            className='input-text'
            aria-describedby='username-hint'
          />
          <p id='username-hint' className='input-hint'>
            Choose a unique username for your account
          </p>
        </div>

        <div>
          <label htmlFor='password-input' className='input-label'>
            Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id='password-input'
            value={password}
            onChange={event => handleInputChange(event, 'password')}
            placeholder='Enter your password'
            required
            aria-required='true'
            className='input-text'
            aria-describedby='password-hint'
          />
          <p id='password-hint' className='input-hint'>
            Create a strong password with at least 8 characters
          </p>
        </div>

        <div>
          <label htmlFor='confirm-password-input' className='input-label'>
            Confirm Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id='confirm-password-input'
            value={passwordConfirmation}
            onChange={e => handleInputChange(e, 'confirmPassword')}
            placeholder='Confirm your password'
            required
            aria-required='true'
            className='input-text'
            aria-describedby='confirm-password-hint'
          />
          <p id='confirm-password-hint' className='input-hint'>
            Re-enter your password to confirm
          </p>
        </div>

        <div className='show-password'>
          <input
            type='checkbox'
            id='showPasswordToggle'
            checked={showPassword}
            onChange={togglePasswordVisibility}
            aria-label='Show Passwords'
          />
          <label htmlFor='showPasswordToggle'>Show Passwords</label>
        </div>

        <button type='submit' className='signup-button' aria-label='Create Account'>
          Submit
        </button>
      </form>

      <Link to='/' className='login-link' aria-label='Navigate to Login Page'>
        Have an account? Login here.
      </Link>
    </div>
  );
};

export default Signup;
