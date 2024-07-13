import React, { useEffect, useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import { useNavigate, useLocation } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!userInfo);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!userInfo);
  }, [userInfo]);

  const onLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
      navigate(`/dashboard/?q=${encodeURIComponent(searchQuery)}`); 
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  const onClickNotex = () => {
    if (isLoggedIn) {
      window.location.href = '/dashboard/';
    }
  }

  const notSignedInPaths = ['/signup', '/signup/', '/login', '/login/'];
  const notSignedIn = notSignedInPaths.includes(location.pathname);

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
        <h2 className={`text-xl font-medium text-black py-2 ${
        userInfo ? 'cursor-pointer' : 'cursor-default'}`} onClick={onClickNotex}>NOTEX</h2>

        {!notSignedIn && (
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => {
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        )}

        <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  )
}

export default Navbar