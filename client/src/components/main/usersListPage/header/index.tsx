import React from 'react';
import './index.css';
import useUserSearch from '../../../../hooks/useUserSearch';

/**
 * Interface representing the props for the UserHeader component.
 *
 * userCount - The number of users to be displayed in the header.
 * setUserFilter - A function that sets the search bar filter value.
 */
interface UserHeaderProps {
  userCount: number;
  setUserFilter: (search: string) => void;
}

/**
 * UsersListHeader component displays the header section for a list of users.
 * It includes the title and search bar to filter the user.
 * Username search is case-sensitive.
 *
 * @param userCount - The number of users displayed in the header.
 * @param setUserFilter - Function that sets the search bar filter value.
 */
const UsersListHeader = ({ userCount, setUserFilter }: UserHeaderProps) => {
  const { val, handleInputChange } = useUserSearch(setUserFilter);

  return (
    <div>
      <div className='space_between right_padding'>
        <div className='bold_title'>Users List</div>
        <input
          id='user_search_bar'
          placeholder='Search Usernames ...'
          type='text'
          value={val}
          onChange={handleInputChange}
        />
      </div>
      <div className='space_between right_padding'>
        <div id='user_count'>{userCount} users</div>
      </div>
    </div>
  );
};

export default UsersListHeader;
