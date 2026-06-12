import React from 'react';

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="empty-state">
    <p>{message}</p>
    <style>{`
      .empty-state {
        text-align: center;
        padding: 3rem;
        background: white;
        border-radius: 8px;
        color: var(--secondary);
      }
    `}</style>
  </div>
);

export default EmptyState;
