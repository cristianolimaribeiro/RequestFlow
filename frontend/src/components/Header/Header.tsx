import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="header-info">
          <h2>Olá, {user?.name}</h2>
          <span className="user-role">{user?.role}</span>
        </div>
      </div>
      <div className="header-actions">
        <button onClick={handleLogout} className="btn-logout">Sair</button>
      </div>
    </header>
  );
};

export default Header;
