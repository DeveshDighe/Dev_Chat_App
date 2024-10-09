import React, { memo } from 'react';


const ChatLoading = () => {
  return (
    <div className="chat-loading">
      <div className="message-placeholder user-message"></div>
      <div className="message-placeholder bot-message"></div>
      <div className="message-placeholder user-message"></div>
      <div className="message-placeholder bot-message"></div>
      <div className="message-placeholder user-message"></div>
      <div className="message-placeholder user-message"></div>
      <div className="message-placeholder bot-message"></div>
      <div className="message-placeholder user-message"></div>
      {/* <div className="message-placeholder bot-message"></div>
      <div className="message-placeholder user-message"></div> */}
    </div>
  );
};

export default memo(ChatLoading);
