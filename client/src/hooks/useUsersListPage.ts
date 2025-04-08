import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { SafeDatabaseUser, UserUpdatePayload } from '../types/types';
import { getUsers } from '../services/userService';

/**
 * Custom hook for managing the users list page state, filtering, and real-time updates.
 *
 * @returns titleText - The current title of the users list page
 * @returns ulist - The list of users to display
 * @returns setUserFilter - Function to set the filtering value of the user search.
 */
const useUsersListPage = () => {
  const { socket } = useUserContext();

  const [userFilter, setUserFilter] = useState<string>('');
  const [userList, setUserList] = useState<SafeDatabaseUser[]>([]);

  useEffect(() => {
    /**
     * Function to fetch users based and update the user list
     */
    const fetchData = async () => {
      try {
        const res = await getUsers();
        setUserList(res || []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    /**
     * Removes a user from the userList using a filter
     * @param prevUserList the list of users
     * @param user the user to remove
     * @returns a list without the given user
     */
    const removeUserFromList = (prevUserList: SafeDatabaseUser[], user: SafeDatabaseUser) =>
      prevUserList.filter(otherUser => user.username !== otherUser.username);

    /**
     * Adds a user to the userList, if not present. Otherwise updates the user.
     * @param prevUserList the list of users
     * @param user the user to add
     * @returns a list with the user added, or updated if present.
     */
    const addUserToList = (prevUserList: SafeDatabaseUser[], user: SafeDatabaseUser) => {
      const userExists = prevUserList.some(otherUser => otherUser.username === user.username);

      if (userExists) {
        // Update the existing user
        return prevUserList.map(otherUser =>
          otherUser.username === user.username ? user : otherUser,
        );
      }

      return [user, ...prevUserList];
    };

    /**
     * Function to handle user updates from the socket.
     *
     * @param user - the updated user object.
     */
    const handleModifiedUserUpdate = (userUpdate: UserUpdatePayload) => {
      setUserList(prevUserList => {
        switch (userUpdate.type) {
          case 'created':
          case 'updated':
            return addUserToList(prevUserList, userUpdate.user);
          case 'deleted':
            return removeUserFromList(prevUserList, userUpdate.user);
          default:
            throw new Error('Invalid user update type');
        }
      });
    };

    fetchData();

    socket.on('userUpdate', handleModifiedUserUpdate);

    return () => {
      socket.off('userUpdate', handleModifiedUserUpdate);
    };
  }, [socket]);

  const filteredUserlist = userList.filter(user => user.username.includes(userFilter));
  return { userList: filteredUserlist, setUserFilter };
};

export default useUsersListPage;
