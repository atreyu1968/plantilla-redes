import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Records } from './pages/Records';
import { Courses } from './pages/Courses';
import { Projects } from './pages/Projects';
import { Admin } from './pages/Admin';
import { Resources } from './pages/Resources';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Users } from './pages/Users';
import { useAuth } from './stores/auth';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/" /> : <Register />} 
        />
        
        <Route 
          path="/" 
          element={user ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="records" element={<Records />} />
          <Route path="courses" element={<Courses />} />
          <Route path="projects" element={<Projects />} />
          <Route path="resources" element={<Resources />} />
          <Route 
            path="admin" 
            element={user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} 
          />
          <Route 
            path="users" 
            element={user?.role === 'admin' ? <Users /> : <Navigate to="/" />} 
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;