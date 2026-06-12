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
    <span className={`badge ${styles[status]} status-badge`}>
      <span className="status-dot"></span>
      {status.replace('_', ' ')}
      <style>{`
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: currentColor;
          opacity: 0.8;
        }
      `}</style>
    </span>
  );
};

export default StatusBadge;
