import React from 'react';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';
import useProfileSettings from '../../hooks/useProfileSettings';
import './index.css';
import useLoginContext from '../../hooks/useLoginContext';

const ProfileSettings = () => {
  // Use the theme context
  const { isHighContrast, setIsHighContrast, isDarkMode, setIsDarkMode } = useTheme();
  const { user } = useLoginContext();

  const {
    userData,
    loading,
    editBioMode,
    newBio,
    newPassword,
    confirmNewPassword,
    successMessage,
    errorMessage,
    showConfirmation,
    pendingAction,
    canEditProfile,
    showPassword,
    togglePasswordVisibility,

    setEditBioMode,
    setNewBio,
    setNewPassword,
    setConfirmNewPassword,
    setShowConfirmation,

    handleResetPassword,
    handleUpdateBiography,
    handleDeleteUser,
  } = useProfileSettings();

  if (loading) {
    return (
      <div className='page-container'>
        <div className='profile-card'>
          <h2>Loading user data...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className='page-container'>
      <div className='profile-card'>
        <h2>Profile</h2>
        {successMessage && <p className='success-message'>{successMessage}</p>}
        {errorMessage && <p className='error-message'>{errorMessage}</p>}
        {userData ? (
          <>
            <h4>General Information</h4>
            <p>
              <strong>Username:</strong> {userData.username}
            </p>

            {/* Biography Section */}
            {!editBioMode && (
              <p>
                <strong>Biography:</strong> {userData.biography || 'No biography yet.'}
                {canEditProfile && (
                  <button
                    className='login-button'
                    style={{ marginLeft: '1rem' }}
                    onClick={() => {
                      setEditBioMode(true);
                      setNewBio(userData.biography || '');
                    }}>
                    Edit
                  </button>
                )}
              </p>
            )}

            {editBioMode && canEditProfile && (
              <div style={{ margin: '1rem 0' }}>
                <input
                  className='input-text'
                  type='text'
                  value={newBio}
                  onChange={e => setNewBio(e.target.value)}
                />
                <button
                  className='login-button'
                  style={{ marginLeft: '1rem' }}
                  onClick={handleUpdateBiography}>
                  Save
                </button>
                <button
                  className='delete-button'
                  style={{ marginLeft: '1rem' }}
                  onClick={() => setEditBioMode(false)}>
                  Cancel
                </button>
              </div>
            )}

            <p>
              <strong>Date Joined:</strong>{' '}
              {userData.dateJoined ? new Date(userData.dateJoined).toLocaleDateString() : 'N/A'}
            </p>

            {/* Reset Password Section */}
            {canEditProfile && (
              <>
                <h4>Reset Password</h4>
                <input
                  className='input-text'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='New Password'
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <input
                  className='input-text'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Confirm New Password'
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                />
                <button className='toggle-password-button' onClick={togglePasswordVisibility}>
                  {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                </button>
                <button className='login-button' onClick={handleResetPassword}>
                  Reset
                </button>
              </>
            )}

            {/* Danger Zone (Delete User) */}
            {canEditProfile && (
              <>
                <h4>Danger Zone</h4>
                <button className='delete-button' onClick={handleDeleteUser}>
                  Delete This User
                </button>
              </>
            )}
          </>
        ) : (
          <p>No user data found. Make sure the username parameter is correct.</p>
        )}

        {/* Confirmation Modal for Delete */}
        {showConfirmation && (
          <div className='modal'>
            <div className='modal-content'>
              <p>
                Are you sure you want to delete user <strong>{userData?.username}</strong>? This
                action cannot be undone.
              </p>
              <button className='delete-button' onClick={() => pendingAction && pendingAction()}>
                Confirm
              </button>
              <button className='cancel-button' onClick={() => setShowConfirmation(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Theme Toggle Section */}
      <div
        className='display-settings'
        style={{
          marginTop: '20px',
          padding: '15px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: isDarkMode ? '#333' : '#f7f7f7',
        }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Display Settings</h3>

        {/* Dark Mode Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            padding: '8px',
            backgroundColor: isDarkMode ? '#444' : '#eee',
            borderRadius: '4px',
          }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              fontWeight: 'bold',
            }}>
            Dark Mode
            <input
              type='checkbox'
              checked={isDarkMode}
              onChange={async () => {
                const newValue = !isDarkMode;
                setIsDarkMode(newValue);

                if (user) {
                  await axios.patch('/api/user/updatePreferences', {
                    username: user.username,
                    darkMode: newValue,
                    highContrast: isHighContrast,
                  });
                }
              }}
              style={{ marginLeft: 'auto', width: '20px', height: '20px' }}
            />
          </label>
        </div>

        {/* High Contrast Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            backgroundColor: isDarkMode ? '#444' : '#eee',
            borderRadius: '4px',
          }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              fontWeight: 'bold',
            }}>
            High Contrast Mode
            <input
              type='checkbox'
              checked={isHighContrast}
              onChange={async () => {
                const newValue = !isHighContrast;
                setIsHighContrast(newValue);

                if (user) {
                  await axios.patch('/api/user/updatePreferences', {
                    username: user.username,
                    darkMode: isDarkMode,
                    highContrast: newValue,
                  });
                }
              }}
              style={{ marginLeft: 'auto', width: '20px', height: '20px' }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
