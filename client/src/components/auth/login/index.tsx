import { useEffect } from 'react';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
import { Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import auth from '../../../firebase';
import useAuth from '../../../hooks/useAuth';
import './index.css';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    recaptchaWidgetId?: number;
  }
}

/**
 * Renders a login form with username and password inputs, password visibility toggle,
 * error handling, and a link to the signup page.
 */
const Login = () => {
  const {
    username,
    password,
    showPassword,
    err,
    handleSubmit,
    handleInputChange,
    togglePasswordVisibility,
    loginWithGoogle,
  } = useAuth('login');

  useEffect(() => {
    const containerExists = document.getElementById('recaptcha-container');

    if (!containerExists) {
      console.error('❌ reCAPTCHA container not found in DOM');
      return;
    }

    if (!window.recaptchaVerifier) {
      const authInstance = getAuth(); // Get correct Auth instance

      window.recaptchaVerifier = new RecaptchaVerifier(authInstance, 'recaptcha-container', {
        size: 'invisible',
        callback: (response: string) => {
          console.log('✅ reCAPTCHA solved with response:', response);
        },
      });

      window.recaptchaVerifier.render().then((widgetId: number) => {
        window.recaptchaWidgetId = widgetId;
        console.log('✅ reCAPTCHA rendered, widget ID:', widgetId);
      });
    }
  }, []);

  return (
    <>
      <div id='recaptcha-container' /> {/* ✅ MUST BE OUTSIDE main container */}
      <div className='container'>
        <h2>Welcome to FakeStackOverflow!</h2>
        <h3>Please login to continue.</h3>
        <form onSubmit={handleSubmit}>
          <h4>Please enter your username.</h4>
          <input
            type='text'
            value={username}
            onChange={event => handleInputChange(event, 'username')}
            placeholder='Enter your username'
            required
            className='input-text'
            id='username-input'
          />
          <h4>Please enter your password.</h4>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={event => handleInputChange(event, 'password')}
            placeholder='Enter your password'
            required
            className='input-text'
            id='password-input'
          />
          <div className='show-password'>
            <input
              type='checkbox'
              id='showPasswordToggle'
              checked={showPassword}
              onChange={togglePasswordVisibility}
            />
            <label htmlFor='showPasswordToggle'>Show Password</label>
          </div>
          <button type='submit' className='login-button'>
            Submit
          </button>
        </form>
        {err && <p className='error-message'>{err}</p>}

        <div className='google-login-container'>
          <Button
            onClick={loginWithGoogle}
            colorScheme='red'
            mt={4}
            className='google-login-button'
            aria-label='Login with Google'>
            Login with Google
          </Button>
        </div>

        <Link to='/signup' className='signup-link'>
          Don&apos;t have an account? Sign up here.
        </Link>
      </div>
    </>
  );
};

export default Login;
