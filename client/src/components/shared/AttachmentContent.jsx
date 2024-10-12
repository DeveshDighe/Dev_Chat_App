import React, { memo } from 'react'

const AttachmentContent = ({message, user, timeAgo}) => {
  return (
      <span
        key={message._id}
        className={`${
          message?.sender._id === user?._id
            ? 'self-end bg-[#93d6fa] text-left'
            : 'self-start bg-[#9f90f3] text-left'
        } inline-block p-2 rounded-lg text-left`}
      >
        {message.content}
        <p className="text-[10px] text-right ml-3 mr-10">{timeAgo}</p>
      </span>
  )
}

export default memo(AttachmentContent);