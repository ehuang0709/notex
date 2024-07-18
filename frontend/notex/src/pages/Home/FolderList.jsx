import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import FolderCard from '../../components/Cards/FolderCard'; 

const FolderList = () => {

  const [allFolders, setAllFolders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    getAllFolders();
  }, []);

  return (
    <div className='container mx-auto'>
      {loading ? (
        <div></div>
      ) : (
        allFolders.length > 0 ? (
          <div className='grid grid-cols-6 gap-4 mt-4 mx-12'>
            {allFolders.map((folder) => (
                <FolderCard key={folder._id} folder={folder} />
            ))}
          </div>
        ) : (
            <div>No folders found. Create a new folder to get started.</div>
        )
      )}
    </div>
  )
}

export default FolderList