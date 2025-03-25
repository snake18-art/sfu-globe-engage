
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Index from '@/pages/Index';
import Study from '@/pages/Study';
import Clubs from '@/pages/Clubs';
import Quizzes from '@/pages/Quizzes';
import Leaderboard from '@/pages/Leaderboard';
import MinorGames from '@/pages/MinorGames';
import Attendance from '@/pages/Attendance';
import NotFound from '@/pages/NotFound';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
import Marketplace from '@/pages/Marketplace';
import Newsfeed from '@/pages/Newsfeed';
import AIAssistant from '@/pages/AIAssistant';
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    // Move Router to be the outermost wrapper
    <Router>
      <div className="app">
        {/* Place AuthProvider inside Router so useNavigate works correctly */}
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/study" element={<Study />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/games" element={<MinorGames />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/newsfeed" element={<Newsfeed />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
