import React, { useState, useRef, useEffect } from 'react';
import { CiFolderOn } from 'react-icons/ci';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';

const FolderCard = ({ folder, onEdit, onDelete, onDoubleClick }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cardRef = useRef(null);
  const dropdownRef = useRef(null);


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (
      cardRef.current &&
      !cardRef.current.contains(event.target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
      setIsSelected(false);
    }
  };

  const handleCardClick = () => {
    setIsSelected(!isSelected);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      ref={cardRef} 
      className={`rounded-xl p-4 cursor-pointer ${ 
        isSelected ? 'bg-blue-100 border border-blue-100' : 'hover:bg-slate-200 border' } `} 
      onDoubleClick={() => onDoubleClick(folder)} 
      onClick={handleCardClick}
      >
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <CiFolderOn className='text-lg text-slate-600' />
          <h6 className='text-sm font-normal text-slate-600 truncate max-w-24'>{folder.name}</h6>
        </div>
        <div className='relative'>

          {/* EDIT/DELETE DROPDOWN BUTTON */}
          <button
            onClick={toggleDropdown}
            className='text-sm text-slate-600 cursor-pointer relative rounded-full p-1 hover:bg-slate-300 transition-all ease-in-out'
          >
            <BsThreeDotsVertical />
          </button>

          {/* DROPDOWN */}
          <div
            ref={dropdownRef}
            className={`absolute right-0 mt-2 w-36 bg-white border rounded shadow-lg overflow-hidden transition-all duration-500 ease-in-out ${
              isDropdownOpen ? 'h-auto' : 'h-0 border-none'
            }`}
            style={{
              maxHeight: isDropdownOpen ? '200px' : '0px',
              visibility: isDropdownOpen ? 'visible' : 'hidden',
            }}
          >

            {/* EDIT BUTTON */}
            <button
              onClick={() => {
                onEdit(folder);
                setIsDropdownOpen(false);
              }}
              className='block w-full text-left px-4 py-2 text-sm text-slate-600 rounded flex items-center space-x-2 hover:bg-slate-100 transition-all ease-in-out'
            >
              <FaPencilAlt className='text-base mr-1' />
              <span>Edit</span>
            </button>

            {/* DELETE BUTTON */}
            <button
              onClick={() => {
                onDelete(folder);
                setIsDropdownOpen(false);
              }}
              className='block w-full text-left px-4 py-2 text-sm text-slate-600 rounded flex items-center space-x-2 hover:bg-slate-100 transition-all ease-in-out'
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
