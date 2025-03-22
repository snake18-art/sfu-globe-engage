
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Index from '@/pages/Index';
import Study from '@/pages/Study';
import Clubs from '@/pages/Clubs';
import Quizzes from '@/pages/Quizzes';
import Leaderboard from '@/pages/Leaderboard';
import MinorGames from '@/pages/MinorGames';
import Attendance from '@/pages/Attendance';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/study" element={<Study />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/games" element={<MinorGames />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
