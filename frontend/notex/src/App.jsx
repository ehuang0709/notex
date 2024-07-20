import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import Folder from './pages/Folder/Folder';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard/" exact element={<Home />} />
        <Route path="/folder/:folderId/" exact element={<Folder />} />
        <Route path="/login/" exact element={<Login />} />
        <Route path="/signup/" exact element={<SignUp />} />
      </Routes>
    </Router>
  )
}

export default App