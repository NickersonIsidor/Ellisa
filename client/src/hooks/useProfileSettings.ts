import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getAuth,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import {
  getUserByUsername,
  deleteUser,
  resetPassword,
  updateBiography,
} from '../services/userService';
import { SafeDatabaseUser } from '../types/types';
import useUserContext from './useUserContext';
import useThemeManagement from './useThemeManagement';
import auth from '../firebase';

interface Grecaptcha {
  reset: (widgetId?: number) => void;
}
declare const grecaptcha: Grecaptcha;

/**
 * A custom hook to encapsulate all logic/state for the ProfileSettings component.
 */
const useProfileSettings = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useUserContext();

  // Use the theme management hook for theme-related functionality
  const { isDarkMode, isHighContrast, updateThemePreferences } = useThemeManagement();

  // Local state
  const [userData, setUserData] = useState<SafeDatabaseUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [editBioMode, setEditBioMode] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // For delete-user confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationId, setVerificationId] = useState('');

  const canEditProfile =
    currentUser.username && userData?.username ? currentUser.username === userData.username : false;

  const clearRecaptcha = () => {
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
        delete window.recaptchaVerifier;
        console.log('reCAPTCHA cleared');
      } catch (e) {
        console.error('Failed to clear reCAPTCHA:', e);
      }
    }
  };

  useEffect(
    () => () => {
      clearRecaptcha();
    },
    [],
  );

  useEffect(() => {
    if (!username) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await getUserByUsername(username);
        setUserData(data);
      } catch (error) {
        setErrorMessage('Error fetching user profile');
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  /**
   * Toggles the visibility of the password fields.
   */
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  /**
   * Validate the password fields before attempting to reset.
   */
  const validatePasswords = () => {
    if (newPassword.trim() === '' || confirmNewPassword.trim() === '') {
      setErrorMessage('Please enter and confirm your new password.');
      return false;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match.');
      return false;
    }
    return true;
  };

  /**
   * Handler for resetting the password
   */
  const handleResetPassword = async () => {
    if (!username) return;
    if (!validatePasswords()) {
      return;
    }
    try {
      await resetPassword(username, newPassword);
      setSuccessMessage('Password reset successful!');
      setErrorMessage(null);
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      setErrorMessage('Failed to reset password.');
      setSuccessMessage(null);
    }
  };

  const handleUpdateBiography = async () => {
    if (!username) return;
    try {
      // Await the async call to update the biography
      const updatedUser = await updateBiography(username, newBio);

      // Ensure state updates occur sequentially after the API call completes
      await new Promise(resolve => {
        setUserData(updatedUser); // Update the user data
        setEditBioMode(false); // Exit edit mode
        resolve(null); // Resolve the promise
      });

      setSuccessMessage('Biography updated!');
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Failed to update biography.');
      setSuccessMessage(null);
    }
  };

  /**
   * Handler for deleting the user (triggers confirmation modal)
   */
  const handleDeleteUser = () => {
    if (!username) return;
    setShowConfirmation(true);
    setPendingAction(() => async () => {
      try {
        await deleteUser(username);
        setSuccessMessage(`User "${username}" deleted successfully.`);
        setErrorMessage(null);
        navigate('/');
      } catch (error) {
        setErrorMessage('Failed to delete user.');
        setSuccessMessage(null);
      } finally {
        setShowConfirmation(false);
      }
    });
  };

  // Updated handleEnableMFA function
  const handleEnableMFA = async () => {
    try {
      setSuccessMessage(null);
      setErrorMessage(null);

      // Validate input
      if (!phoneNumber || !phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
        throw new Error('Phone number must be in international format (e.g., +15555555555)');
      }

      const authInstance = getAuth();
      const firebaseUser = authInstance.currentUser;
      if (!firebaseUser) {
        throw new Error('You must be logged in to enable MFA');
      }

      // Clear any existing reCAPTCHA widget
      clearRecaptcha();

      // Create a new reCAPTCHA verifier
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        throw new Error('reCAPTCHA container not found');
      }

      const recaptchaVerifier = new RecaptchaVerifier(authInstance, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: string) => {
          console.log('✅ reCAPTCHA verified with response:', response);
        },
        'expired-callback': () => {
          console.log('❌ reCAPTCHA expired, refreshing...');
          setErrorMessage('reCAPTCHA expired. Please try again.');
          clearRecaptcha();
        },
      });

      window.recaptchaVerifier = recaptchaVerifier;

      // Render the reCAPTCHA to generate a token
      await recaptchaVerifier.render();
      console.log('✅ reCAPTCHA rendered successfully');

      // Get multi-factor session
      const multiFactorSession = await multiFactor(firebaseUser).getSession();
      console.log('✅ Got multi-factor session');

      // Send verification code using the session
      const phoneInfoOptions = {
        phoneNumber,
        session: multiFactorSession,
      };

      const phoneProvider = new PhoneAuthProvider(authInstance);
      console.log('📱 Sending verification code to:', phoneNumber);

      // Show a loading message to the user
      setSuccessMessage('Sending verification code...');

      const verId = await phoneProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);

      // Store the verification ID and open the modal
      setVerificationId(verId);
      setIsVerificationModalOpen(true);

      console.log('✅ Verification code sent successfully');
      setSuccessMessage('Verification code sent to your phone');
    } catch (error) {
      console.error('❌ Error enabling MFA:', error);

      // Handle specific Firebase error codes
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-phone-number':
            setErrorMessage(
              'The phone number format is incorrect. Please use international format (+1XXXXXXXXXX).',
            );
            break;
          case 'auth/quota-exceeded':
            setErrorMessage('SMS quota exceeded. Please try again later.');
            break;
          case 'auth/user-disabled':
            setErrorMessage('This user account has been disabled.');
            break;
          case 'auth/captcha-check-failed':
            setErrorMessage('reCAPTCHA verification failed. Please refresh and try again.');
            break;
          default:
            setErrorMessage(`Failed to enable MFA: ${error.message}`);
        }
      } else {
        setErrorMessage(`Failed to enable MFA: ${(error as Error).message}`);
      }

      // Clean up reCAPTCHA after error
      clearRecaptcha();
    }
  };

  const handleVerificationCodeSubmit = async (code: string) => {
    try {
      if (!code || code.length !== 6) {
        throw new Error('Please enter a valid 6-digit verification code');
      }

      const authInstance = getAuth();
      const firebaseUser = authInstance.currentUser;
      if (!firebaseUser || !verificationId) {
        throw new Error('Session expired. Please try again.');
      }

      setSuccessMessage('Verifying code...');

      console.log('🔐 Creating phone credential and assertion');
      const phoneCredential = PhoneAuthProvider.credential(verificationId, code);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneCredential);

      // Enroll the MFA factor
      await multiFactor(firebaseUser).enroll(multiFactorAssertion, 'Phone Number');

      // Close the modal and clean up
      setIsVerificationModalOpen(false);
      setVerificationId('');
      clearRecaptcha();

      console.log('✅ MFA enrollment successful!');
      setSuccessMessage('Multi-Factor Authentication has been enabled for your account!');
    } catch (error) {
      console.error('❌ Error verifying code:', error);

      // Handle specific Firebase error codes
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/code-expired':
            setErrorMessage('The verification code has expired. Please try again.');
            break;
          case 'auth/invalid-verification-code':
            setErrorMessage('The verification code is invalid. Please check and try again.');
            break;
          default:
            setErrorMessage(`Verification failed: ${error.message}`);
        }
      } else {
        setErrorMessage(`Verification failed: ${(error as Error).message}`);
      }

      // Close the modal but don't clear the phone number so they can try again
      setIsVerificationModalOpen(false);
      clearRecaptcha();
    }
  };

  // Handle modal cancellation
  const handleVerificationCancel = () => {
    setIsVerificationModalOpen(false);
    setVerificationId('');
    clearRecaptcha();
    setErrorMessage('MFA enrollment cancelled');
  };

  /**
   * Handler for toggling dark mode
   */
  const handleDarkModeToggle = () => {
    updateThemePreferences(!isDarkMode, isHighContrast);

    // If we have user data, update it locally for immediate feedback
    if (userData) {
      const updatedUserData = {
        ...userData,
        darkMode: !isDarkMode,
      };
      setUserData(updatedUserData);
    }
  };

  /**
   * Handler for toggling high contrast mode
   */
  const handleHighContrastToggle = () => {
    updateThemePreferences(isDarkMode, !isHighContrast);

    // If we have user data, update it locally for immediate feedback
    if (userData) {
      const updatedUserData = {
        ...userData,
        highContrast: !isHighContrast,
      };
      setUserData(updatedUserData);
    }
  };

  return {
    userData,
    newPassword,
    confirmNewPassword,
    setNewPassword,
    setConfirmNewPassword,
    loading,
    editBioMode,
    setEditBioMode,
    newBio,
    setNewBio,
    successMessage,
    errorMessage,
    showConfirmation,
    setShowConfirmation,
    pendingAction,
    setPendingAction,
    canEditProfile,
    showPassword,
    togglePasswordVisibility,
    handleResetPassword,
    handleUpdateBiography,
    handleDeleteUser,
    phoneNumber,
    setPhoneNumber,
    handleEnableMFA,
    handleDarkModeToggle,
    handleHighContrastToggle,
    isDarkMode,
    isHighContrast,
    isVerificationModalOpen,
    verificationId,
    handleVerificationCodeSubmit,
    handleVerificationCancel,
  };
};

export default useProfileSettings;
