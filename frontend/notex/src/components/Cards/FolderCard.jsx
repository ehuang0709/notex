import React, { useState, useRef, useEffect } from 'react';
import { CiFolderOn } from 'react-icons/ci';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';

const FolderCard = ({ folder, onEdit, onDelete }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const truncateFolderName = (name, maxLength) => {
    if (name.length > maxLength) {
      return `${name.substring(0, maxLength)}...`;
    }
    return name;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='border rounded-xl p-4 hover:bg-slate-200'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <CiFolderOn className='text-lg text-slate-600' />
          <h6 className='text-sm font-normal text-slate-600'>{truncateFolderName(folder.name, 12)}</h6>
        </div>
        <div className='relative'>
          <button
            onClick={toggleDropdown}
            className='text-sm text-slate-600 cursor-pointer relative rounded-full p-1 hover:bg-slate-300 transition-all ease-in-out'
          >
            <BsThreeDotsVertical />
          </button>
          <div
            ref={dropdownRef}
            className={`absolute right-0 mt-2 w-36 bg-white border rounded shadow-lg overflow-hidden transition-all duration-500 ease-in-out ${
              isDropdownOpen ? 'h-auto' : 'h-0'
            }`}
            style={{
              maxHeight: isDropdownOpen ? '200px' : '0px',
              visibility: isDropdownOpen ? 'visible' : 'hidden',
            }}
          >
            <button
              onClick={() => {
                onEdit(folder);
                setIsDropdownOpen(false);
              }}
              className='block w-full text-left px-4 py-2 text-sm text-slate-700 rounded flex items-center space-x-2 hover:bg-slate-100 transition-all ease-in-out'
            >
              <FaPencilAlt className='text-base mr-1' />
              <span>Edit</span>
            </button>
            <button
              onClick={() => {
                onDelete(folder);
                setIsDropdownOpen(false);
              }}
              className='block w-full text-left px-4 py-2 text-sm text-slate-700 rounded flex items-center space-x-2 hover:bg-slate-100 transition-all ease-in-out'
            >
              <FaTrashAlt className='text-base mr-1' />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderCard;
