import { useState } from 'react';
import {
  getAuth,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  multiFactor,
  RecaptchaVerifier,
} from 'firebase/auth';
import auth from '../../firebase';

const EnrollMFA = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const startEnrollment = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not signed in.');

      const session = await multiFactor(user).getSession();

      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response: string) => {
          console.log('reCAPTCHA solved:', response);
        },
      });

      const phoneAuthProvider = new PhoneAuthProvider(auth);

      const id = await phoneAuthProvider.verifyPhoneNumber(
        {
          phoneNumber,
          session,
        },
        recaptchaVerifier,
      );

      setVerificationId(id);
      setMessage('✅ Code sent. Check your phone!');
    } catch (err) {
      console.error(err);
      setMessage(`❌ Error: ${(err as Error).message}`);
    }
  };

  const confirmCode = async () => {
    try {
      const cred = PhoneAuthProvider.credential(verificationId, code);
      const assertion = PhoneMultiFactorGenerator.assertion(cred);

      const user = auth.currentUser;
      if (!user) throw new Error('User not signed in.');

      await multiFactor(user).enroll(assertion, 'My Phone Number');
      setMessage('✅ MFA enrollment successful!');
    } catch (err) {
      console.error(err);
      setMessage(`❌ Error verifying code: ${(err as Error).message}`);
    }
  };

  return (
    <div>
      <h2>Enroll in MFA</h2>
      <input
        type='tel'
        placeholder='+1 555-555-5555'
        value={phoneNumber}
        onChange={e => setPhoneNumber(e.target.value)}
      />
      <button onClick={startEnrollment}>Send Verification Code</button>

      {verificationId && (
        <>
          <input
            type='text'
            placeholder='Enter the code'
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <button onClick={confirmCode}>Confirm Code</button>
        </>
      )}

      <div id='recaptcha-container' />
      {message && <p>{message}</p>}
    </div>
  );
};

export default EnrollMFA;
