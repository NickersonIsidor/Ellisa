import React from 'react';
import './index.css';
import { SafeDatabaseUser } from '../../../../types/types';

/**
 * Interface representing the props for the User component.
 *
 * user - The user object containing details about the user.
 * handleUserCardViewClickHandler - The function to handle the click event on the user card.
 */
interface UserProps {
  user: SafeDatabaseUser;
  handleUserCardViewClickHandler: (user: SafeDatabaseUser) => void;
}

/**
 * User component renders the details of a user including its username and dateJoined.
 * Clicking on the component triggers the handleUserPage function,
 * and clicking on a tag triggers the clickTag function.
 *
 * @param user - The user object containing user details.
 */
const UserCardView = (props: UserProps) => {
  const { user, handleUserCardViewClickHandler } = props;

  return (
    <div className='user right_padding' onClick={() => handleUserCardViewClickHandler(user)}>
      <div className='user_mid'>
        <div className='userUsername'>{user.username}</div>
      </div>
      <div className='userStats'>
        <div>joined {new Date(user.dateJoined).toUTCString()}</div>
      </div>
    </div>
  );
};

export default UserCardView;
