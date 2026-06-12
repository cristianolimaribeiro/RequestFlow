import React from 'react';
import { RequestPriority } from '../../types/request';

const PriorityBadge: React.FC<{ priority: RequestPriority }> = ({ priority }) => {
  const styles: Record<RequestPriority, string> = {
    baixa: 'bg-success',
    media: 'bg-info',
    alta: 'bg-warning',
    critica: 'bg-danger',
  };

  return (
    <span className={`badge ${styles[priority]} priority-badge`}>
      {priority}
      <style>{`
        .priority-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          letter-spacing: 0.05em;
        }
      `}</style>
    </span>
  );
};

export default PriorityBadge;
