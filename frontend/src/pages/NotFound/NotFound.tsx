import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="not-found" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--primary)' }}>404</h1>
      <h2 style={{ marginBottom: '1.5rem' }}>Página não encontrada</h2>
      <p style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>A página que você está procurando não existe ou foi movida.</p>
      <Link to="/dashboard" className="btn btn-primary">Voltar para o Início</Link>
    </div>
  );
};

export default NotFound;
