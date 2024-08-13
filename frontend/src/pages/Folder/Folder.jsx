import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Modal from "react-modal"
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import AddEditNotes from '../Home/AddEditNotes'
import axiosInstance from '../../utils/axiosInstance';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import Toast from '../../components/ToastMessage/Toast'
import { MdAdd } from "react-icons/md"
import { TiWarningOutline } from "react-icons/ti"


const Folder = () => {

  const [openAddEditNoteModal, setOpenAddEditNoteModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showConfirmDeleteNoteModal, setShowConfirmDeleteNoteModal] = useState({
    isShown: false,
    note: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const { folderId } = useParams(); 
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [notes, setNotes] = useState([]);
  const [folder, setFolder] = useState(null);
  const [allFolders, setAllFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalWidth, setModalWidth] = useState('40%');

  const navigate = useNavigate();

  const handleEditNote = (noteDetails) => {
    setModalWidth('40%');
    setOpenAddEditNoteModal({ isShown: true, data: noteDetails, type: 'edit' });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  // GET USER INFO
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/login/");
      }
    }
  };

  // GET ALL NOTES
  const getAllNotes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/get-all-notes");
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // GET NOTES IN FOLDER
  const getNotesInFolder = async (folderId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/get-notes/${folderId}`);
      if (response.data && response.data.notes) {
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.log('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // GET FOLDER DETAILS
  const getFolderDetails = async (folderId) => {
    try {
      const response = await axiosInstance.get(`/get-folder/${folderId}`);
      if (response.data && response.data.folder) {
        setFolder(response.data.folder);
      }
    } catch (error) {
      console.log('An unexpected error occurred. Please try again.');
    }
  };

  // DELETE NOTES
  const deleteNote = async (noteId) => {
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if (response.data && !response.data.error) {
        showToastMessage("Note has been deleted", 'delete');
        getNotesInFolder(folderId);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // SEARCH FOR NOTE
  const onSearchNote = async (query) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE PINNED NOTES
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
        "isPinned": !noteData.isPinned,
      });

      if (response.data && response.data.note) {
        getNotesInFolder(folderId);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleClearSearch = () => {
    setIsSearch(false);
    navigate(`/dashboard/`);
    getNotesInFolder();
  };

  const closeAddEditNoteModal = () => {
    setOpenAddEditNoteModal({ isShown: false });
    setModalWidth('40%');
  }

  const handleDeleteNoteClick = (note) => {
    setShowConfirmDeleteNoteModal({ isShown: true, note });
  };

  const confirmDeleteNote = () => {
    deleteNote(showConfirmDeleteNoteModal.note._id);
    setShowConfirmDeleteNoteModal({ isShown: false, note: null });
  }

  const cancelDeleteNote = () => {
    setShowConfirmDeleteNoteModal({ isShown: false, note: null });
  }

  const toggleModalWidth = () => {
    setModalWidth(prevWidth => (prevWidth === '40%' ? '80%' : '40%'));
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query');

    if (query) {
      onSearchNote(query);
      setIsSearch(true);
    } else {
      getNotesInFolder(folderId);
      getFolderDetails(folderId);
    }
    getUserInfo();
  }, [folderId]);

  return (
    <>
      <Navbar 
        userInfo={userInfo} 
        onSearchNote={onSearchNote} 
        handleClearSearch={handleClearSearch} 
      />

      <div className="container mx-auto">
        <div className="mx-12 mt-24 text-sm text-slate-400">
          <Link to="/dashboard">Home</Link> {folder && `> ${folder.name}`}
        </div>
        <div className="notes-section">
          <div className="mx-12 mt-4 text-xs text-slate-400">NOTES</div>
          {loading ? (
            <div></div>
          ) : (
            notes.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 mt-6 mx-12">
                {notes.map((note) => (
                  <NoteCard
                    key={note._id}
                    title={note.title}
                    date={note.createdOn}
                    content={note.content}
                    tags={note.tags}
                    isPinned={note.isPinned}
                    onEdit={() => handleEditNote(note)}
                    onDelete={() => handleDeleteNoteClick(note)}
                    onPinNote={() => updateIsPinned(note)}
                  />
                ))}
              </div>
            ) : (
              <EmptyCard 
                message1={
                  isSearch 
                    ? 'Oops! No notes found matching your search.' 
                    : `Start creating your first note!`
                }
                message2={
                  isSearch 
                    ? 'Please edit your search query or create a new note.' 
                    : `Click the 'Add' button to jot down your thoughts, ideas, and reminders. Let's get started!`
                }
              />
            )
          )}
        </div>
      </div>

      {/* Add Note Button */}
      <button 
        className='w-14 h-14 flex items-center justify-center rounded-full bg-slate-800 shadow-xl hover:bg-slate-900 transition-all fixed right-10 bottom-10' 
        onClick={() => {
          setOpenAddEditNoteModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className='text-[32px] text-white' />
      </button>

      {/* Add/Edit Note Modal */}
      <Modal
        isOpen={openAddEditNoteModal.isShown}
        onRequestClose={closeAddEditNoteModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className={`w-[${modalWidth}] max-h-[80vh] bg-white rounded-md mx-auto mt-14 p-5 overflow-hidden outline-none transition-all overflow-y-auto scrollbar-custom`}
      ><AddEditNotes
          type={openAddEditNoteModal.type}
          noteData={openAddEditNoteModal.data}
          allFolders={allFolders}
          onClose={() => {
            setOpenAddEditNoteModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={() => getNotesInFolder(folderId)}
          showToastMessage={showToastMessage}
          toggleModalWidth={toggleModalWidth}
          currentFolderId={folderId}
        />
      </Modal>

      {/* Confirm Delete Note Modal */}
      <Modal
        isOpen={showConfirmDeleteNoteModal.isShown}
        onRequestClose={cancelDeleteNote}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
        contentLabel='Confirm Delete'
        className="w-[26%] bg-white rounded-lg mx-auto px-6 py-8 overflow-hidden outline-none transition-all"
      >
        <div className="flex flex-col items-center">
          <div className='w-11 h-11 flex items-center justify-center rounded-full bg-red-100 mb-3'>
              <TiWarningOutline className='text-[28px] text-red-500' />
          </div>
          <h2 className="text-center font-semibold mb-3">Are you sure?</h2>
          <p className='text-center text-sm font-light text-slate-600'>This action cannot be undone. All data associated with this note will be permanently lost.</p>
          <div className="flex flex-col justify-center mt-4 w-full">
              <button
                  className="bg-red-600 text-white py-2 rounded-md w-full mb-3 transition-all hover:bg-red-500 hover:shadow-lg"
                  onClick={confirmDeleteNote}
              >
                  Delete
              </button>
              <button
                  className="border-2 border-gray-200 py-2 rounded-md w-full transition-all hover:bg-gray-200"
                  onClick={cancelDeleteNote}
              >
                  Cancel
              </button>
          </div>
        </div>
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Folder;
