import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from "react-icons/md"
import AddEditNotes from './AddEditNotes'
import Modal from "react-modal"
import { useNavigate, useLocation } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import Toast from '../../components/ToastMessage/Toast'
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import { TiWarningOutline } from "react-icons/ti";


const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState({
    isShown: false,
    note: null,
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: 'edit' });
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

  const handleClearSearch = () => {
    setIsSearch(false);
    navigate(`/dashboard/`);
    getAllNotes();
  };

  const closeAddEditModal = () => {
    setOpenAddEditModal({ isShown: false })
  }

  const handleDeleteClick = (note) => {
    setShowConfirmDeleteModal({ isShown: true, note });
  };

  const confirmDelete = () => {
    deleteNote(showConfirmDeleteModal.note._id);
    setShowConfirmDeleteModal({ isShown: false, note: null });
  }

  const cancelDelete = () => {
    setShowConfirmDeleteModal({ isShown: false, note: null });
  }

  useEffect(() => {
    // Check if there is a query parameter in the URL and perform search if present
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query');

    if (query) {
      onSearchNote(query);
      setIsSearch(true);
    } else {
      getAllNotes();
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
        {loading ? (
          <div></div>
        ) : (
          allNotes.length > 0 ? (
            <div className='grid grid-cols-3 gap-4 mt-8 mx-12'>
              {allNotes.map((item) => (
                <NoteCard 
                  key={item._id}
                  title={item.title} 
                  date={item.createdOn}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDeleteClick(item)}
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

      <button 
        className='w-14 h-14 flex items-center justify-center rounded-full bg-slate-800 shadow-xl hover:bg-slate-900 transition-all absolute right-10 bottom-10' 
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={closeAddEditModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-hidden outline-none transition-all"
      ><AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Modal
        isOpen={showConfirmDeleteModal.isShown}
        onRequestClose={cancelDelete}
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
                  onClick={confirmDelete}
              >
                  Delete
              </button>
              <button
                  className="border-2 border-gray-200 py-2 rounded-md w-full transition-all hover:bg-gray-200"
                  onClick={cancelDelete}
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