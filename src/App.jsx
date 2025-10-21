import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

import Header from './components/layout/Header.jsx';
import ProtectedRoute from './components/ProtectesRoute.jsx';

// Import Pages
import LandingPage from './pages/LandingPage.jsx';
import TeacherLogin from './pages/TeacherLogin.jsx';
import StudentLogin from './pages/StudentLogin.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import AddTeacher from './pages/AddTeacher.jsx';
import StudentForm from './pages/StudentForm.jsx';
import StudentProfile from './pages/StudentProfile.jsx';
import EditStudentProfile from './pages/EditStudentProfile.jsx';
import ManageSessions from './pages/ManageSessions.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="app-container">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login/teacher" element={<TeacherLogin />} />
            <Route path="/login/student" element={<StudentLogin />} />

            {/* Teacher / Admin Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-teacher"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AddTeacher />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-sessions"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageSessions />
                </ProtectedRoute>
              }
            />
            {/* Student Protected Routes */}
            <Route
              path="/student/new-profile"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/edit-profile"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <EditStudentProfile />
                </ProtectedRoute>
              }
            />
            {/* Fallback Route */}
            <Route path="*" element={<h1>404: Page Not Found</h1>} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;