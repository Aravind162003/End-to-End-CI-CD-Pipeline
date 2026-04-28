import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserHome from './pages/UserHome';
import AdminHome from './pages/AdminHome';
import MyProfile from './pages/MyProfile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userHome" element={<UserHome />} />
        <Route path="/adminHome" element={<AdminHome />} />
        <Route path="/my-profile" element={<MyProfile/>}/>
      </Routes>
    </Router>
  );
};

export default App;