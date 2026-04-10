import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import SkillTasks from './pages/SkillTasks';
import Quiz from './pages/Quiz';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#050505]">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roadmap/skill/:skillId" element={<SkillTasks />} />
          <Route path="/roadmap/skill/:skillId/task/:taskId/quiz" element={<Quiz />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
