// src/Router.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Scrap from './component/Scrap';
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Scrap />} />
        
        {/* You can add more routes here */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
