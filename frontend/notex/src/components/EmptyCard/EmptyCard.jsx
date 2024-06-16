import React from 'react'

const EmptyCard = ({ imgSrc, message1, message2 }) => {
  return (
    <div className='border rounded p-4 bg-white shadow-sm flex flex-col items-center justify-center mt-8 mx-20'>
        <p className='text-sm font-medium text-slate-700 text-center leading-7 mt-5'>
          {message1}
        </p>
        <p className='text-sm font-small text-slate-500 text-center leading-7 mb-5'>
          {message2}
        </p>
    </div>
  )
};

export default EmptyCard;