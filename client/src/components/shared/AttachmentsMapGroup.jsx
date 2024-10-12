import React, { memo } from 'react'
import { fileFormat } from '../../lib/features';
import RenderAttachment from '../../lib/helper_components/RenderAttachment';

const AttachmentsMapGroup = ({ attachments, message, user, timeAgo ,index}) => {
  return (
    <>
      {attachments.map((attachment) => {
        const url = attachment.url;
        const file = fileFormat(url); // Assuming fileFormat is your function to determine the file type

        return (
          <div key={`${index}_${timeAgo}`} className={`${message?.sender._id === user?._id ? 'self-end max-w-[55%]' : ' flex gap-x-2 max-w-[55%]'}`}>
            {message?.sender._id !== user?._id &&
              <div className=' w-6 h-6 mt-1'>
                <img className=' w-full h-full object-cover rounded-3xl' src={message?.sender?.avatar?.url} alt="sender dp" />
              </div>
            }
            <div
              key={attachment.public_id} // Ensure uniqueness by using the public_id for attachments
              className={`${message?.sender._id === user?._id
                  ? 'self-end bg-[#93d6fa] text-left'
                  : 'self-start bg-[#9f90f3] text-left'
                } inline-block p-2 rounded-lg text-left`}
            >
              <p className=' font-semibold mb-2'>{message?.sender._id === user?._id ? 'you' : `${message.sender.name}`}</p>
              <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                {RenderAttachment(file, url)} {/* Render the appropriate component based on the file type */}
              </a>
              <p className="text-[10px] mt-2 text-right ml-3">{timeAgo}</p>
            </div>
            
          </div>
        );
      })}
    </>
  )
}

export default memo(AttachmentsMapGroup)