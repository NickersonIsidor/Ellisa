import './index.css';
import React from 'react';
import useMessagingPage from '../../../hooks/useMessagingPage';
import MessageCard from '../messageCard';

const MessagingPage = () => {
  const { messages, newMessage, setNewMessage, handleSendMessage, error } = useMessagingPage();

  return (
    <main className='chat-room' role='main' aria-labelledby='chat-room-heading'>
      <header className='chat-header' role='banner'>
        <h1 id='chat-room-heading' aria-label='Public Chat Room'>
          Chat Room
        </h1>
      </header>

      <section className='chat-messages' aria-label='Message Thread' aria-live='polite'>
        {messages.map((message, index) => (
          <MessageCard
            key={String(message._id)}
            message={message}
            aria-posinset={index + 1}
            aria-setsize={messages.length}
          />
        ))}
      </section>

      <div className='message-input' role='form'>
        <label htmlFor='chat-message-input' className='sr-only'>
          Enter your message
        </label>
        <textarea
          id='chat-message-input'
          className='message-textbox'
          placeholder='Type your message here'
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          aria-describedby='message-input-instructions'
        />
        <p id='message-input-instructions' className='sr-only'>
          Enter your message and press send to communicate with other users
        </p>

        <div className='message-actions'>
          <button
            type='button'
            className='send-button'
            onClick={handleSendMessage}
            aria-label='Send Message'>
            Send
          </button>

          {error && (
            <span className='error-message' role='alert' aria-live='assertive'>
              {error}
            </span>
          )}
        </div>
      </div>
    </main>
  );
};

export default MessagingPage;
