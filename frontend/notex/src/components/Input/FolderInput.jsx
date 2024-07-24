import React, { useEffect, useRef, useState } from 'react';
import { FaAngleDown } from "react-icons/fa";

const FolderInput = ({ folders, selectedFolder, setSelectedFolder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectFolderRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (
      selectFolderRef.current &&
      !selectFolderRef.current.contains(event.target) &&
      dropdownRef.current && 
      !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  
  const handleSelect = (folderId) => {
    setSelectedFolder(folderId);
    setIsOpen(false);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateName = (name, maxLength = 14) => {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  useEffect(() => {
    if (dropdownRef.current) {
      dropdownRef.current.style.height = isOpen ? `${dropdownRef.current.scrollHeight}px` : '0px';
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className='relative'>
      <label className='input-label'>FOLDER</label>
      <div className='mt-3 select-none'>

        {/* SELECT FOLDER BOX */}
        <div
          ref={selectFolderRef}
          className='text-sm w-[196.8px] cursor-pointer flex items-center justify-between border rounded px-3 py-2'
          onClick={handleToggle}
        >
          {/* FOLDER NAME */}
          <span className={`flex items-center gap-2 ${!selectedFolder && 'text-slate-400'} `}>
            {selectedFolder ? truncateName(folders.find(f => f._id === selectedFolder)?.name) : "Select..."}
          </span>

          <FaAngleDown className={`transition-transform text-slate-700 ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {/* DROPDOWN */}
        {isOpen && (
          <div
            ref={dropdownRef} 
            className={`absolute bottom-1/2 text-sm w-64 bg-white border rounded max-h-56 overflow-y-auto scrollbar-custom transition-all duration-300 ease-out ${isOpen ? 'animate-slideUp' : 'animate-slideDown'} `}
            style={{
              height: '-10px',
              opacity: '0',
            }}
          >

            {/* SEARCH BAR */}
            <input
              type='text'
              placeholder='Search...'
              className='w-full px-3 py-2 border-b focus:outline-none'
              value={searchTerm}
              onChange={handleSearchChange}
            />

            {/* FOLDER OPTIONS */}
            <ul>
              {filteredFolders.length > 0 ? (
                filteredFolders.map(folder => (
                  <li
                    key={folder._id}
                    className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                    onClick={() => handleSelect(folder._id)}
                  >
                    {folder.name.length > 18 ? `${folder.name.substring(0, 18)}...` : folder.name}
                  </li>
                ))
              ) : (
                <li className='px-4 py-2 text-gray-500'>No results found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default FolderInput;
