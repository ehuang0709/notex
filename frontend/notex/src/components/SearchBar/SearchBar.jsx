import React from 'react'
import { FaMagnifyingGlass  } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  const onKeyUp = (event) => {
    if (event.key === 'Enter') {
      if (value.trim() === "") {
        onClearSearch();
      } else {
        handleSearch();
      }
    }
  };

  return (
    <div className='w-80 flex items-center px-4 bg-slate-100 rounded-md'>
      <input
        type='text'
        placeholder='Search Notes'
        className='w-full text-xs bg-transparent py-[11px] outline-none'
        value={value}
        onChange={onChange}
        onKeyUp={onKeyUp}
      />

      {value && (
        <IoMdClose 
          className='text-xl text-slate-500 cursor-pointer hover:text-black mr-3' 
          onClick={onClearSearch} 
        />
      )}

      <div className='p-2 rounded-full hover:bg-gray-200'>
        <FaMagnifyingGlass 
          className='text-slate-500 cursor-pointer' 
          onClick={handleSearch} 
        />
      </div>
    </div>
  )
}

export default SearchBar