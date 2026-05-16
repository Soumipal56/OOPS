import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './screens/Login';
import Quiz from './screens/Quiz';
import RateYourself from './screens/RateYourself';
import Swipe from './screens/Swipe';
import Match from './screens/Match';
import Payment from './screens/Payment';
import Chat from './screens/Chat';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <ToastContainer 
          position="top-center"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--accent-pink)', color: 'white', backdropFilter: 'blur(10px)' }}
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/rate" element={<RateYourself />} />
          <Route path="/swipe" element={<Swipe />} />
          <Route path="/match" element={<Match />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
