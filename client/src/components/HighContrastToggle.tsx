import React from 'react';

interface HighContrastToggleProps {
  isHighContrast: boolean;
  setIsHighContrast: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode?: boolean;
}

const HighContrastToggle: React.FC<HighContrastToggleProps> = ({
  isHighContrast,
  setIsHighContrast,
  isDarkMode = false,
}) => {
  // Type-safe window with theme state
  type WindowWithThemeState = Window & {
    __THEME_STATE__?: {
      forceApplyHighContrastStyles?: () => void;
    };
  };

  // Handle toggle with direct style application
  const handleToggle = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);

    // Apply styles immediately if turning on
    if (newValue) {
      const windowWithThemeState = window as WindowWithThemeState;
      if (windowWithThemeState.__THEME_STATE__?.forceApplyHighContrastStyles) {
        windowWithThemeState.__THEME_STATE__.forceApplyHighContrastStyles();
      }
    }
  };

  return (
    <div
      className='high-contrast-toggle'
      style={{
        display: 'flex',
        alignItems: 'center',
        margin: '10px 0',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
      }}>
      <label
        htmlFor='high-contrast-checkbox'
        style={{
          marginRight: '10px',
          fontWeight: 'bold',
          color: isDarkMode ? '#fff' : '#000',
        }}>
        High Contrast Mode
      </label>
      <input
        type='checkbox'
        id='high-contrast-checkbox'
        checked={isHighContrast}
        onChange={handleToggle}
        style={{
          width: '20px',
          height: '20px',
          cursor: 'pointer',
        }}
      />
    </div>
  );
};

export default HighContrastToggle;
