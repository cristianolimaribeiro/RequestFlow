import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h1>Request<span>Flow</span></h1>
          <button className="sidebar-close" onClick={onClose}>&times;</button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/dashboard" onClick={onClose}>Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/my-requests" onClick={onClose}>Minhas Solicitações</NavLink>
            </li>
            {(user?.role === 'admin' || user?.role === 'approver') && (
              <li>
                <NavLink to="/all-requests" onClick={onClose}>Todas Solicitações</NavLink>
              </li>
            )}
            {user?.role === 'admin' && (
              <>
                <li>
                  <NavLink to="/users" onClick={onClose}>Usuários</NavLink>
                </li>
                <li>
                  <NavLink to="/categories" onClick={onClose}>Categorias</NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
