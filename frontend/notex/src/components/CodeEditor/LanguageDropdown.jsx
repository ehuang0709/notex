import React, { useEffect, useRef, useState } from 'react';
import { GoChevronDown } from "react-icons/go";


const LanguageDropdown = ({ languages, selectedLanguage, setSelectedLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectLanguageRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (
      selectLanguageRef.current &&
      !selectLanguageRef.current.contains(event.target) &&
      dropdownRef.current && 
      !dropdownRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };
  
  const handleSelect = (language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className='relative mr-2' ref={selectLanguageRef}>
      <button 
        className='flex items-center px-3 py-1 text-neutral-100 rounded hover:bg-neutral-700 transition-all ease-in-out'
        onClick={handleToggle}
      >
        <span className='mr-1'>{selectedLanguage.label}</span>
        <GoChevronDown className={`transition-transform text-sm ${isOpen ? 'rotate-180' : ''}`}/>
      </button>
      {isOpen && (
        <div className='absolute w-28 right-0 mt-1 bg-zinc-800 text-neutral-100 rounded shadow-lg z-10' ref={dropdownRef}>
          {languages.map(language => (
            <button
              key={language.value}
              className='block px-3 py-2 w-full text-left hover:bg-zinc-700 transition-all ease-in-out'
              onClick={() => handleSelect(language)}
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageDropdown;
