import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';

const AddEditFolders = ({ folderData = {}, type, getAllFolders, onClose, showToastMessage }) => {
  const [name, setName] = useState(folderData?.name || "");
  const [error, setError] = useState(null);

  // Add Folder
  const addNewFolder = async () => {
    try {
      const response = await axiosInstance.post("/add-folder/", { name });

      if (response.data && response.data.folder) {
        showToastMessage("Folder has been created");
        getAllFolders();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  // Edit Folder
  const editFolder = async () => {
    const folderId = folderData._id;
    try {
      const response = await axiosInstance.put("/edit-folder/" + folderId, { name });

      if (response.data && response.data.folder) {
        showToastMessage("Folder has been updated");
        getAllFolders();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddFolder = () => {
    if (!name) {
        setError("Please enter the folder name");
        return;
    }

    setError("");

    if (type === 'edit') {
        editFolder();
    } else {
        addNewFolder();
    }
  }

  return (
    <div className='relative'>
      <button 
        className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50' 
        onClick={onClose}
      >
        <MdClose className='text-xl text-slate-400' />
      </button>

      <div className='flex flex-col gap-2'>
        <label className='input-label'>FOLDER NAME</label>
        <input
          type='text'
          className='text-2xl text-slate-950 outline-none'
          placeholder='Work Projects'
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
      </div>

      {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

      <button className='btn-primary font-medium mt-6 p-3 transition-all ease-in-out' onClick={handleAddFolder}>
        {type === 'edit' ? 'UPDATE' : "CREATE"}
      </button>
    </div>
  );
};

export default AddEditFolders;
