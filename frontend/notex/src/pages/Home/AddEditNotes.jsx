import React, { useState, useEffect } from 'react';
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';

const AddEditNotes = ({ noteData = {}, type, getAllNotes, onClose, showToastMessage }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(noteData?.folderId || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axiosInstance.get('/get-all-folders');
        if (response.data && response.data.folders) {
          setFolders(response.data.folders);
        }
      } catch (error) {
        console.log("Error fetching folders.");
      }
    };

    fetchFolders();
  }, []);

  // Add Note
  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title, 
        content, 
        tags,
        folderId: selectedFolder
      });

      if (response.data && response.data.note) {
        showToastMessage("Note has been added");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  // Edit Note
  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        title, 
        content, 
        tags,
        folderId: selectedFolder
      });

      if (response.data && response.data.note) {
        showToastMessage("Note has been updated");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
        setError("Please enter the title");
        return;
    }

    if (!content) {
        setError("Please enter the content");
        return;
    }

    setError("");

    if (type === 'edit') {
        editNote();
    } else {
        addNewNote();
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
        <label className='input-label'>TITLE</label>
        <input
          type='text'
          className='text-2xl text-flate-950 outline-none'
          placeholder='Go To Gym At 5'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className='flex flex-col gap-2 mt-4'>
        <label className='input-label'>CONTENT</label>
        <textarea
          type='text'
          className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
          placeholder='Content'
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className='mt-3'>
        <label className='input-label'>TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      <div className='mt-3'>
        <label className='input-label'>FOLDER</label>
        <div className='flex items-center mt-3 input-label'>
          <select
            className='text-sm bg-transparent border px-2 py-2 rounded outline-none'
            value={selectedFolder || ""}
            onChange={({ target }) => setSelectedFolder(target.value)}
          >
            <option value="">Select...</option>
            {folders.map(folder => (
              <option key={folder._id} value={folder._id}>{folder.name}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

      <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>
        {type === 'edit' ? 'UPDATE' : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
