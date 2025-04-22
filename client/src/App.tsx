import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
// Components
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useContext(UserContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to='/login' />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          {/* Protected routes */}
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Fallback route */}
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
