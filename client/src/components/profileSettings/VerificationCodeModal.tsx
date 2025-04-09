// Create a new file VerificationCodeModal.tsx
import React, { useState, useEffect, useRef } from 'react';

interface VerificationCodeModalProps {
  isOpen: boolean;
  phoneNumber: string;
  onSubmit: (code: string) => void;
  onCancel: () => void;
}

const VerificationCodeModal: React.FC<VerificationCodeModalProps> = ({
  isOpen,
  phoneNumber,
  onSubmit,
  onCancel,
}) => {
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(60); // 60 second countdown
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    // Only start the timer if the modal is open
    if (isOpen && timer > 0) {
      timerId = setTimeout(() => setTimer(timer - 1), 1000);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [timer, isOpen]); // Include isOpen in the dependency array

  if (!isOpen) return null;

  return (
    <div className='verification-modal-overlay'>
      <div className='verification-modal'>
        <h3>Verification Code</h3>
        <p>
          Enter the 6-digit code sent to <strong>{phoneNumber}</strong>
        </p>

        <input
          ref={inputRef}
          type='text'
          value={code}
          onChange={e => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
          placeholder='6-digit code'
          maxLength={6}
          className='verification-code-input'
        />

        <div className='timer-text'>
          {timer > 0 ? (
            <p>Code expires in {timer} seconds</p>
          ) : (
            <p className='expired-text'>Code has expired. Please try again.</p>
          )}
        </div>

        <div className='modal-actions'>
          <button className='cancel-button' onClick={onCancel}>
            Cancel
          </button>
          <button
            className='submit-button'
            onClick={() => onSubmit(code)}
            disabled={code.length !== 6 || timer === 0}>
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationCodeModal;
