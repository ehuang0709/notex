import React from 'react'

const AddEditNotes = () => {
  return (
    <div>
      <div className='flex flex-col gap-2'>
        <label className='input-label'>TITLE</label>
        <input
          type='text'
          className='text-2xl text-flate-950 outline-none'
          placeholder='Go To Gym At 5'
        />
      </div>
    </div>
  )
}

export default AddEditNotes