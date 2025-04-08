import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import {
  getMultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  GoogleAuthProvider,
  signInWithPopup,
  MultiFactorError,
} from 'firebase/auth';
import auth from '../firebase';
import useLoginContext from './useLoginContext';
import { createUser, loginUser } from '../services/userService';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Custom hook to manage authentication logic, including handling input changes,
 * form submission, password visibility toggling, and error validation for both
 * login and signup processes.
 *
 * @param authType - Specifies the authentication type ('login' or 'signup').
 * @returns {Object} An object containing:
 *   - username: The current value of the username input.
 *   - password: The current value of the password input.
 *   - passwordConfirmation: The current value of the password confirmation input (for signup).
 *   - showPassword: Boolean indicating whether the password is visible.
 *   - err: The current error message, if any.
 *   - handleInputChange: Function to handle changes in input fields.
 *   - handleSubmit: Function to handle form submission.
 *   - togglePasswordVisibility: Function to toggle password visibility.
 */
const useAuth = (authType: 'login' | 'signup') => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState<string>('');
  const { setUser } = useLoginContext();
  const navigate = useNavigate();
  const { setIsDarkMode, setIsHighContrast } = useTheme();

  /**
   * Toggles the visibility of the password input field.
   */
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  /**
   * Handles changes in input fields and updates the corresponding state.
   *
   * @param e - The input change event.
   * @param field - The field being updated ('username', 'password', or 'confirmPassword').
   */
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: 'username' | 'password' | 'confirmPassword',
  ) => {
    const fieldText = e.target.value.trim();

    if (field === 'username') {
      setUsername(fieldText);
    } else if (field === 'password') {
      setPassword(fieldText);
    } else if (field === 'confirmPassword') {
      setPasswordConfirmation(fieldText);
    }
  };

  /**
   * Validates the input fields for the form.
   * Ensures required fields are filled and passwords match (for signup).
   *
   * @returns {boolean} True if inputs are valid, false otherwise.
   */
  const validateInputs = (): boolean => {
    if (username === '' || password === '') {
      setErr('Please enter a username and password');
      return false;
    }

    if (authType === 'signup' && password !== passwordConfirmation) {
      setErr('Passwords do not match');
      return false;
    }

    return true;
  };

  /**
   * Handles the submission of the form.
   * Validates input, performs login/signup, and navigates to the home page on success.
   *
   * @param event - The form submission event.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    let user;

    try {
      if (authType === 'signup') {
        user = await createUser({ username, password });
      } else if (authType === 'login') {
        user = await loginUser({ username, password });
      } else {
        throw new Error('Invalid auth type');
      }

      setUser({
        ...user,
        darkMode: user.darkMode ?? false,
        highContrast: user.highContrast ?? false,
      });
      navigate('/home');
    } catch (error) {
      setErr((error as Error).message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // const token = await result.user.getIdToken();
      const { email } = result.user; // Extract email from Firebase user

      if (!email) {
        throw new Error('No email found in Google account');
      }

      const passwordToUse = result.user.uid;

      // console.log('✅ Google Login Attempt with Email:', email);

      let user;

      try {
        user = await loginUser({ username: email, password: passwordToUse });
      } catch (error) {
        user = await createUser({ username: email, password: passwordToUse });
      }

      setUser({
        ...user,
        darkMode: user.darkMode ?? false,
        highContrast: user.highContrast ?? false,
      });
      navigate('/home');
    } catch (error: unknown) {
      // Step 2: Handle MFA-required error
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === 'auth/multi-factor-auth-required'
      ) {
        try {
          const mfaError = error as MultiFactorError;
          const resolver = getMultiFactorResolver(auth, mfaError);

          const recaptcha = window.recaptchaVerifier;
          const phoneInfoOptions = {
            multiFactorHint: resolver.hints[0],
            session: resolver.session,
          };

          const phoneProvider = new PhoneAuthProvider(auth);
          const verificationId = await phoneProvider.verifyPhoneNumber(phoneInfoOptions, recaptcha);

          // eslint-disable-next-line no-alert
          const verificationCode = prompt('Enter the 2FA code sent to your phone:');
          if (!verificationCode) throw new Error('2FA was cancelled.');

          const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
          const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

          const finalResult = await resolver.resolveSignIn(multiFactorAssertion);
          const { email, uid } = finalResult.user;

          if (!email) throw new Error('No email found in MFA account');

          const passwordToUse = uid;
          let user;

          try {
            user = await loginUser({ username: email, password: passwordToUse });
          } catch {
            user = await createUser({ username: email, password: passwordToUse });
          }

          setIsDarkMode(user.darkMode ?? false);
          setIsHighContrast(user.highContrast ?? false);
          setUser(user);
          navigate('/home');
        } catch (mfaError) {
          setErr((mfaError as Error).message);
        }
      } else {
        setErr((error as Error).message);
      }
    }
  };

  /* const apiBaseUrl =
  process.env.REACT_APP_API_URL ||
  'http://localhost:8000' ||
  'https://cs4530-s25-xyy-419.onrender.com';

  */

  return {
    username,
    password,
    passwordConfirmation,
    showPassword,
    err,
    handleInputChange,
    handleSubmit,
    togglePasswordVisibility,
    loginWithGoogle,
  };
};

export default useAuth;
