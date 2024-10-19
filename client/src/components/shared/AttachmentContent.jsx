import React, { memo } from 'react'

const AttachmentContent = ({message, user, timeAgo}) => {
  return (
      <span
        key={message._id}
        className={`${
          message?.sender._id === user?._id
            ? 'self-end bg-[#93d6fa] text-left'
            : 'self-start ml-8 max-custom-mdb:ml-8 max-md:ml-8 max-custom-xSmall:ml-[10%] bg-[#9f90f3] text-left'
        } inline-block p-2 rounded-lg text-left`}
      >
        {message.content}
        <p className="text-[10px] text-right ml-3 mr-10">{timeAgo}</p>
      </span>
  )
}

export default memo(AttachmentContent);