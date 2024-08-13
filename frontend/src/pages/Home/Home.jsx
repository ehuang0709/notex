import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import FolderCard from '../../components/Cards/FolderCard'; 
import { MdAdd } from "react-icons/md"
import AddEditNotes from './AddEditNotes'
import AddEditFolders from './AddEditFolders'
import Modal from "react-modal"
import { useNavigate, useLocation } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import Toast from '../../components/ToastMessage/Toast'
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import { TiWarningOutline } from "react-icons/ti"

const Home = () => {

  const [openAddEditNoteModal, setOpenAddEditNoteModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openAddEditFolderModal, setOpenAddEditFolderModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });  

  const [showConfirmDeleteNoteModal, setShowConfirmDeleteNoteModal] = useState({
    isShown: false,
    note: null,
  });

  const [showConfirmDeleteFolderModal, setShowConfirmDeleteFolderModal] = useState({
    isShown: false,
    note: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [allFolders, setAllFolders] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalWidth, setModalWidth] = useState('40%');

  const navigate = useNavigate();
  const location = useLocation();

  const handleEditNote = (noteDetails) => {
    setModalWidth('40%');
    setOpenAddEditNoteModal({ isShown: true, data: noteDetails, type: 'edit' });
  };

  const handleEditFolder = (folderDetails) => {
    setOpenAddEditFolderModal({ isShown: true, data: folderDetails, type: 'edit' });
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
        navigate("/login");
      }
    }
  };

  // GET ALL NOTES
  const getAllNotes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/get-all-notes");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // DELETE NOTES
  const deleteNote = async (noteId) => {
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if (response.data && !response.data.error) {
        showToastMessage("Note has been deleted", 'delete');
        getAllNotes();
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
        setAllNotes(response.data.notes);
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
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // GET ALL FOLDERS
  const getAllFolders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/get-all-folders/");

      if (response.data && response.data.folders) {
        setAllFolders(response.data.folders);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // DELETE FOLDER
  const deleteFolder = async (folderId) => {
    try {
      const response = await axiosInstance.delete("/delete-folder/" + folderId);

      if (response.data && !response.data.error) {
        showToastMessage("Folder has been deleted", 'delete');
        getAllFolders();
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    navigate(`/dashboard/`);
    getAllNotes();
  };

  const closeAddEditNoteModal = () => {
    setOpenAddEditNoteModal({ isShown: false });
    setModalWidth('40%');
  }

  const handleDeleteNoteClick = (note) => {
    setShowConfirmDeleteNoteModal({ isShown: true, note });
  };

  const handleDeleteFolderClick = (folder) => {
    setShowConfirmDeleteFolderModal({ isShown: true, folder });
  };

  const confirmDeleteNote = () => {
    deleteNote(showConfirmDeleteNoteModal.note._id);
    setShowConfirmDeleteNoteModal({ isShown: false, note: null });
  }

  const confirmDeleteFolder = () => {
    deleteFolder(showConfirmDeleteFolderModal.folder._id);
    setShowConfirmDeleteFolderModal({ isShown: false, folder: null });
  }

  const cancelDeleteNote = () => {
    setShowConfirmDeleteNoteModal({ isShown: false, note: null });
  }

  const cancelDeleteFolder = () => {
    setShowConfirmDeleteFolderModal({ isShown: false, folder: null });
  }

  const handleFolderDoubleClick = (folder) => {
    navigate(`/folder/${folder._id}`);
  }

  const closeAddEditFolderModal = () => {
    setOpenAddEditFolderModal({ isShown: false })
  }

  const toggleModalWidth = () => {
    setModalWidth(prevWidth => (prevWidth === '40%' ? '80%' : '40%'));
  };

  useEffect(() => {
    // Check if there is a query parameter in the URL and perform search if present
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q');

    if (query) {
      onSearchNote(query);
      setIsSearch(true);
    } else {
      getAllNotes();
      getAllFolders();
    }

    getUserInfo();

    return () => {};
  }, []);

  return (
    <>
      <Navbar 
        userInfo={userInfo} 
        onSearchNote={onSearchNote} 
        handleClearSearch={handleClearSearch} 
      />

      <div className='container mx-auto'>
        {!isSearch && (
          <>
            <div className='mx-12 mt-24 text-xs text-slate-400'>FOLDERS</div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-4 mx-12'>

              {/* ADD FOLDER BUTTON */}
              <button 
                className='w-full min-h-[58px] flex items-center justify-center border-2 border-dotted border-slate-300 rounded-xl hover:shadow transition-all ease-in-out'
                onClick={() => {
                  setOpenAddEditFolderModal({ isShown: true, type: "add", data: null });
                }}
                style={{ gridColumn: 'span 1' }}
              >
                <MdAdd className='text-[32px] text-slate-300' />
              </button>

              {/* DISPLAY FOLDERS */}
              {loading ? (
                <div></div>
              ) : (
                allFolders.length > 0 && (
                  allFolders.map((folder) => (
                    <FolderCard 
                      key={folder._id} 
                      folder={folder}
                      onEdit={() => handleEditFolder(folder)}
                      onDelete={() => handleDeleteFolderClick(folder)}
                      onDoubleClick={() => handleFolderDoubleClick(folder)}
                      style={{ gridColumn: `span 1` }}
                    />
                  ))
                )
              )}
            </div>
            <hr className='mt-6 mb-4 mx-12' />
          </>
        )}

        {/* DISPLAY NOTES */}
        <div className='notes-section'>
          { !isSearch ? (
            <div className='mx-12 text-xs text-slate-400'>NOTES</div>
          ) : (
            <div className='mx-12 mt-24 text-xs text-slate-400'>SEARCH RESULTS</div>
          )}
          {loading ? (
            <div></div>
          ) : (
            allNotes.length > 0 ? (
              <div className='grid grid-cols-3 gap-4 mt-6 mx-12'>
                {allNotes.map((item) => (
                  <NoteCard 
                    key={item._id}
                    title={item.title} 
                    date={item.createdOn}
                    content={item.content}
                    tags={item.tags}
                    isPinned={item.isPinned}
                    onEdit={() => handleEditNote(item)}
                    onDelete={() => handleDeleteNoteClick(item)}
                    onPinNote={() => updateIsPinned(item)}
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
        className={`${modalWidth === '40%' ? 'w-[40%]' : 'w-[80%]'} max-h-[80vh] bg-white rounded-md mx-auto mt-14 p-5 overflow-hidden outline-none transition-all overflow-y-auto scrollbar-custom`}
      >
        <AddEditNotes
          type={openAddEditNoteModal.type}
          noteData={openAddEditNoteModal.data}
          allFolders={allFolders}
          onClose={() => {
            setOpenAddEditNoteModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
          toggleModalWidth={toggleModalWidth}
        />
      </Modal>

      {/* Add/Edit Folder Modal */}
      <Modal
          isOpen={openAddEditFolderModal.isShown}
          onRequestClose={closeAddEditFolderModal}
          style={{
            overlay: {
              backgroundColor: "rgba(0,0,0,0.2)",
            },
          }}
          contentLabel=""
          className="w-[30%] max-h-3/4 bg-white rounded-md mx-auto p-5 overflow-hidden outline-none transition-all fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          ><AddEditFolders
            type={openAddEditFolderModal.type}
            folderData={openAddEditFolderModal.data}
            onClose={() => {
              setOpenAddEditFolderModal({ isShown: false, type: "add", data: null });
            }}
            getAllFolders={getAllFolders}
            showToastMessage={showToastMessage}
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

      {/* Confirm Delete Folder Modal */}
      <Modal
        isOpen={showConfirmDeleteFolderModal.isShown}
        onRequestClose={cancelDeleteFolder}
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
          <p className='text-center text-sm font-light text-slate-600'>Deleting this folder will remove it from your collection. Notes associated with this folder will remain but will no longer be organized under this folder.</p>
          <div className="flex flex-col justify-center mt-4 w-full">
              <button
                  className="bg-red-600 text-white py-2 rounded-md w-full mb-3 transition-all hover:bg-red-500 hover:shadow-lg"
                  onClick={confirmDeleteFolder}
              >
                  Delete
              </button>
              <button
                  className="border-2 border-gray-200 py-2 rounded-md w-full transition-all hover:bg-gray-200"
                  onClick={cancelDeleteFolder}
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
  )
}

export default Home