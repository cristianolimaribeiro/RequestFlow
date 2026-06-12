import React from 'react';

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="error-state">
    <p>Ocorreu um erro: {message}</p>
    <style>{`
      .error-state {
        text-align: center;
        padding: 2rem;
        background: #fee2e2;
        border-radius: 8px;
        color: #ef4444;
        border: 1px solid #fecaca;
      }
    `}</style>
  </div>
);

export default ErrorState;
