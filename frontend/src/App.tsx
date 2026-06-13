import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import MyRequests from './pages/MyRequests/MyRequests';
import AllRequests from './pages/AllRequests/AllRequests';
import NewRequest from './pages/NewRequest/NewRequest';
import RequestDetails from './pages/RequestDetails/RequestDetails';
import Users from './pages/Users/Users';
import Categories from './pages/Categories/Categories';
import NotFound from './pages/NotFound/NotFound';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/requests/new" element={<NewRequest />} />
            <Route path="/requests/:id" element={<RequestDetails />} />
            
            <Route element={<RoleRoute allowedRoles={['admin', 'approver']} />}>
              <Route path="/all-requests" element={<AllRequests />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/users" element={<Users />} />
              <Route path="/categories" element={<Categories />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
