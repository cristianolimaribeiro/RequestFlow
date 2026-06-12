import React from 'react';
import { RequestStatus } from '../../types/request';

const StatusBadge: React.FC<{ status: RequestStatus }> = ({ status }) => {
  const styles: Record<RequestStatus, string> = {
    aberta: 'bg-info',
    em_analise: 'bg-warning',
    aprovada: 'bg-success',
    reprovada: 'bg-danger',
    cancelada: 'bg-secondary',
    concluida: 'bg-primary',
  };

  return (
    <span className={`badge ${styles[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
