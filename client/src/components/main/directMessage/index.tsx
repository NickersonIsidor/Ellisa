import React from 'react';
import './index.css';
import useDirectMessage from '../../../hooks/useDirectMessage';
import ChatsListCard from './chatsListCard';
import UsersListPage from '../usersListPage';
import MessageCard from '../messageCard';

/**
 * DirectMessage component renders a page for direct messaging between users.
 * It includes a list of users and a chat window to send and receive messages.
 */
const DirectMessage = () => {
  const {
    selectedChat,
    chatToCreate,
    chats,
    newMessage,
    setNewMessage,
    showCreatePanel,
    setShowCreatePanel,
    handleSendMessage,
    handleChatSelect,
    handleUserSelect,
    handleCreateChat,
    error,
  } = useDirectMessage();

  return (
    <>
      <div className='create-panel'>
        <button
          className='custom-button'
          onClick={() => setShowCreatePanel(prevState => !prevState)}>
          {showCreatePanel ? 'Hide Create Chat Panel' : 'Start a Chat'}
        </button>
        {error && <div className='direct-message-error'>{error}</div>}
        {showCreatePanel && (
          <>
            <p>Selected user: {chatToCreate}</p>
            <button className='custom-button' onClick={handleCreateChat}>
              Create New Chat
            </button>
            <UsersListPage handleUserSelect={handleUserSelect} />
          </>
        )}
      </div>
      <div className='direct-message-container'>
        <div className='chats-list'>
          {chats.map(chat => (
            <ChatsListCard key={String(chat._id)} chat={chat} handleChatSelect={handleChatSelect} />
          ))}
        </div>
        <div className='chat-container'>
          {selectedChat ? (
            <>
              <h2>Chat Participants: {selectedChat.participants.join(', ')}</h2>
              <div className='chat-messages'>
                {selectedChat.messages.map(message => (
                  <MessageCard key={String(message._id)} message={message} />
                ))}
              </div>
              <div className='message-input'>
                <input
                  className='custom-input'
                  type='text'
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder='Type a message...'
                />
                <button className='custom-button' onClick={handleSendMessage}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <h2>Select a user to start chatting</h2>
          )}
        </div>
      </div>
    </>
  );
};

export default DirectMessage;
