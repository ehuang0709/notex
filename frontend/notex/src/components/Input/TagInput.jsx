import React, { useState } from 'react'
import { MdAdd, MdClose } from "react-icons/md"

const TagInput = ({ tags, setTags }) => {

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setInputValue(value);
    }
  };

  const addNewTag = () => {
    if (inputValue.trim() !== "") {
        setTags([...tags, inputValue.trim()]);
        setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
        addNewTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  };

  const truncateName = (name) => {
    if (name.length > 18) {
      return name.substring(0, 18) + '...';
    }
    return name;
  };

  return ( 
    <div>
      {tags?.length > 0 && (
        <div className='flex items-center gap-2 flex-wrap mt-2'>
          {tags.map((tag, index) => (
            <span key={index} className="flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded">
                # {truncateName(tag)}
                <button onClick={() => {handleRemoveTag(tag);}}>
                    <MdClose />
                </button>
            </span>
          ))}
        </div>
      )}

      <div className='flex items-center gap-4 mt-3'>
        <input 
          type='text'
          value={inputValue}
          className='text-sm bg-transparent border px-3 py-2 rounded outline-none' 
          placeholder='Add tags' 
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        
        <button 
          className='w-8 h-8 flex items-center justify-center rounded border border-primary hover:bg-primary transition-all ease-in-out'
          onClick={() => {
            addNewTag();
          }}
        >
          <MdAdd className='text-2xl text-primary hover:text-white' />
        </button>
      </div>
    </div>
  )
}

export default TagInput