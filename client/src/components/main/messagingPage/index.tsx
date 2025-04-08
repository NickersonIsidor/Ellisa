import './index.css';
import useMessagingPage from '../../../hooks/useMessagingPage';
import MessageCard from '../messageCard';

/**
 * Represents the MessagingPage component which displays the public chat room.
 * and provides functionality to send and receive messages.
 */
const MessagingPage = () => {
  const { messages, newMessage, setNewMessage, handleSendMessage, error } = useMessagingPage();

  return (
    <div className='chat-room'>
      <div className='chat-header'>
        <h2>Chat Room</h2>
      </div>
      <div className='chat-messages'>
        {messages.map(message => (
          <MessageCard key={String(message._id)} message={message} />
        ))}
      </div>
      <div className='message-input'>
        <textarea
          className='message-textbox'
          placeholder='Type your message here'
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
        />
        <div className='message-actions'>
          <button type='button' className='send-button' onClick={handleSendMessage}>
            Send
          </button>
          {error && <span className='error-message'>{error}</span>}
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
