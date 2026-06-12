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
    <span className={`badge ${styles[priority]}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
