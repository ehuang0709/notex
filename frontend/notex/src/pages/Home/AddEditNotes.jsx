import React, { useState, useEffect } from 'react';
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';
import FolderInput from '../../components/Input/FolderInput';
import { CiCircleChevRight } from "react-icons/ci";
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { FaPlay } from "react-icons/fa";
import { FaCode } from "react-icons/fa6";



const AddEditNotes = ({ noteData = {}, type, getAllNotes, onClose, showToastMessage, currentFolderId, toggleModalWidth }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(noteData?.folderId || currentFolderId || null);
  const [isCodeEditorOpen, setisCodeEditorOpen] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState(noteData?.codeSnippet || '');
  const [codeOutput, setCodeOutput] = useState('');
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
        codeSnippet
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
        codeSnippet
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

  const handleRunCode = () => {
    try {
      setCodeOutput('');

      const code = codeSnippet;
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        setCodeOutput(args.join(' '));
      };

      eval(code);

      console.log = originalConsoleLog;
    } catch (error) {
      setCodeOutput(`Error: ${error.message}`);
    }
  }

  return (
    <div className={`relative ${isCodeEditorOpen ? 'flex' : ''}`}>
      <div className={`${isCodeEditorOpen ? 'w-[48%]' : 'w-full'} transition-all`}>
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
            className={`icon-btn mt-9 text-3xl transition-all ease-in-out hover:text-gray-400 ${isCodeEditorOpen ? 'rotate-180' : ''}`}
            onClick={handleToggle}  
          />
        </div>

        {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

        <button className='btn-primary font-medium mt-5 p-3 transition-all ease-in-out' onClick={handleAddNote}>
          {type === 'edit' ? 'UPDATE' : "ADD"}
        </button>
      </div>

      {isCodeEditorOpen && (
        <div className={`mt-16 ml-8 rounded transition-transform duration-300 ease-in-out ${isCodeEditorOpen ? 'w-[48%]' : 'w-0'} overflow-hidden`}>
          <div className='relative flex justify-between items-center text-xs text-neutral-100 p-1 bg-[#333333] rounded-t'>
            <div className='relative flex items-center p-1'>
              <FaCode className='mr-2 text-green-500'/>
              CODE
            </div>
            <button 
              className='relative flex items-center mr-2 px-2 cursor-pointer p-1 rounded hover:bg-neutral-700 transition-all ease-in-out'
              onClick={handleRunCode}
            >
              <FaPlay className='mr-2 text-gray-400'/>
              Run
            </button>
          </div>
          <CodeMirror
            value={codeSnippet}
            height="216px"
            theme={vscodeDark}
            extensions={[javascript({ jsx: true })]}
            onChange={(value) => setCodeSnippet(value)}
            className='text-xs'
          />
          <div className='mt-4'>
            <div className='text-xs text-neutral-100 p-2 bg-darkCharcoal rounded-t'>OUTPUT</div>
            <pre className='bg-darkGray p-2 rounded-b h-32 text-xs text-neutral-100 text-wrap overflow-y-auto'>{codeOutput}</pre>
          </div>

          
        {/* <CodeMirror
          value={code}
          theme={darcula}
          options={{
            mode: 'javascript',
            lineNumbers: true
          }}
          onChange={(editor, data, value) => setCode(value)}
        /> */}

      </div>
      )}
    </div>
  );
};

export default AddEditNotes;
