import React from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import UserCardView from './userCard';
import UsersListHeader from './header';
import useUsersListPage from '../../../hooks/useUsersListPage';
import { SafeDatabaseUser } from '../../../types/types';

interface UserListPageProps {
  handleUserSelect?: (user: SafeDatabaseUser) => void;
}

const UsersListPage = (props: UserListPageProps) => {
  const { userList, setUserFilter } = useUsersListPage();
  const { handleUserSelect = null } = props;
  const navigate = useNavigate();

  const handleUserCardViewClickHandler = (user: SafeDatabaseUser): void => {
    if (handleUserSelect) {
      handleUserSelect(user);
    } else if (user.username) {
      navigate(`/user/${user.username}`);
    }
  };

  return (
    <main className='user-card-container' role='main' aria-labelledby='users-list-heading'>
      <UsersListHeader userCount={userList.length} setUserFilter={setUserFilter} />

      <section id='users_list' className='users_list' aria-label='List of Users' aria-live='polite'>
        {userList.map((user, index) => (
          <UserCardView
            user={user}
            key={user.username}
            handleUserCardViewClickHandler={handleUserCardViewClickHandler}
            aria-posinset={index + 1}
            aria-setsize={userList.length}
          />
        ))}
      </section>

      {(!userList.length || userList.length === 0) && (
        <div className='bold_title right_padding no-results' role='alert' aria-live='assertive'>
          No Users Found
        </div>
      )}
    </main>
  );
};

export default UsersListPage;
