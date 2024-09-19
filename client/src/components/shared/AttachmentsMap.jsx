import React from 'react'
import { fileFormat } from '../../lib/features';
import RenderAttachment from '../../lib/helper_components/RenderAttachment';

const AttachmentsMap = ({attachments, message, user, timeAgo}) => {
  return (
    <>
    {attachments.map((attachment) => {
      const url = attachment.url;
      const file = fileFormat(url); // Assuming fileFormat is your function to determine the file type

      return (
        <div
          key={attachment.public_id} // Ensure uniqueness by using the public_id for attachments
          className={`${
            message?.sender._id === user._id
              ? 'self-end bg-[#93d6fa] text-left'
              : 'self-start bg-[#9f90f3] text-left'
          } inline-block p-2 rounded-lg text-left`}
        >
          <a href={attachment.url} target="_blank" rel="noopener noreferrer">
            {RenderAttachment(file, url)} {/* Render the appropriate component based on the file type */}
          </a>
          <p className="text-[10px] mt-2 text-right ml-3">{timeAgo}</p>
        </div>
      );
    })}
    </>
  )
}

export default AttachmentsMap