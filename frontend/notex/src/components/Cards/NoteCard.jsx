import React from 'react';
import moment from 'moment';
import { FaRegStar } from "react-icons/fa";
import { MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({ title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) => {
  // Limit the tags to the first 5 and add "more" if there are more tags
  const displayedTags = tags.slice(0, 5);
  const hasMoreTags = tags.length > 5;

  const truncateTag = (tag) => {
    if (tag.length > 25) {
      return tag.substring(0, 25) + '...';
    }
    return tag;
  };

  return (
    <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out flex flex-col h-full'>
      <div className='flex justify-between'>
        <div>
          <h6 className='text-sm font-medium cursor-pointer hover:text-primary transition-all ease-in-out' onClick={onEdit}>{title}</h6>
          <span className='text-xs text-slate-500'>{moment(date).format('MM/DD/YYYY')}</span>
        </div>

        <FaRegStar className={`icon-btn hover:text-primary ${isPinned ? 'text-primary' : 'text-slate-300'}`} onClick={onPinNote} />
      </div>

      <p className='text-xs text-slate-600 mt-2 flex-grow'>{content?.slice(0, 60)}</p>

      <div className='flex items-center justify-between mt-2'>
        <div className='text-xs text-slate-500'>
          {displayedTags.map((item) => `#${truncateTag(item)} `)}
          {hasMoreTags && <><br /><span>+{tags.length - 5} more</span></>}
        </div>

        <div className='flex items-center gap-2'>
          <MdCreate className='icon-btn hover:text-green-600 transition-all ease-in-out' onClick={onEdit} />
          <MdDelete className='icon-btn hover:text-red-500 transition-all ease-in-out' onClick={onDelete} />
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
