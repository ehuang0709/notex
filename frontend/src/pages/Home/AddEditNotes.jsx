import React, { useState, useEffect } from 'react';
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';
import FolderInput from '../../components/Input/FolderInput';
import { CiCircleChevRight } from "react-icons/ci";
import CodeEditor from '../../components/CodeEditor/CodeEditor';


const AddEditNotes = ({ noteData = {}, type, getAllNotes, onClose, showToastMessage, currentFolderId, toggleModalWidth }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(noteData?.folderId || currentFolderId || null);
  const [isCodeEditorOpen, setisCodeEditorOpen] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState(noteData?.codeSnippet || '');
  const [selectedLanguage, setSelectedLanguage] = useState(noteData?.selectedLanguage || 'python')
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

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title, 
        content, 
        tags,
        folderId: selectedFolder,
        codeSnippet,
        selectedLanguage
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

  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        title, 
        content, 
        tags,
        folderId: selectedFolder,
        codeSnippet,
        selectedLanguage
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

  const handleToggle = () => {
    toggleModalWidth();
    setisCodeEditorOpen(!isCodeEditorOpen);
  }

  return (
    <div className={`relative ${isCodeEditorOpen ? 'flex' : ''}`}>
      <div className={`${isCodeEditorOpen ? 'w-[48%]' : 'w-auto'} transition-all`}>
        <button 
          className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50' 
          onClick={onClose}
        >
          <MdClose className='text-xl text-slate-400' />
        </button>

        {/* TITLE */}
        <div className='flex flex-col gap-2'>
          <label className='input-label'>TITLE</label>
          <input
            type='text'
            className='text-2xl text-flate-950 outline-none'
            placeholder='Get Lunch at 12'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        {/* CONTENT */}
        <div className='flex flex-col gap-2 mt-4'>
          <label className='input-label'>CONTENT</label>
          <textarea
            type='text'
            className='text-sm text-slate-900 outline-none bg-slate-50 p-2 rounded'
            placeholder='Content'
            rows={10}
            value={content}
            onChange={({ target }) => setContent(target.value)}
          />
        </div>

        {/* TAGS */}
        <div className='mt-3'>
          <label className='input-label'>TAGS</label>
          <TagInput tags={tags} setTags={setTags} />
        </div>

        {/* FOLDER & CODE EDITOR EXPAND BUTTON*/}
        <div className='flex justify-between items-center mt-3'>
          <FolderInput
            folders={folders}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
          />
          <CiCircleChevRight 
            className={`icon-btn mt-9 text-3xl transition-transform hover:text-gray-400 ${isCodeEditorOpen ? 'rotate-180' : ''}`}
            onClick={handleToggle}  
          />
        </div>

        {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

        <button className='btn-primary font-medium mt-5 p-3 transition-all ease-in-out' onClick={handleAddNote}>
          {type === 'edit' ? 'UPDATE' : "ADD"}
        </button>
      </div>

      {isCodeEditorOpen && (
        <div className={`mt-8 ml-8 rounded transition-transform duration-300 ease-in-out ${isCodeEditorOpen ? 'w-[48%]' : 'w-0'} overflow-hidden`}>
          <CodeEditor
            codeSnippet={codeSnippet}
            setCodeSnippet={setCodeSnippet}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </div>
      )}
    </div>
  );
};

export default AddEditNotes;
