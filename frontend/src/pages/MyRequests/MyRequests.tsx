import React, { useEffect, useState } from 'react';
import { requestService } from '../../services/requestService';
import Loading from '../../components/Loading/Loading';
import ErrorState from '../../components/ErrorState/ErrorState';
import EmptyState from '../../components/EmptyState/EmptyState';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge/PriorityBadge';
import { Link } from 'react-router-dom';
import { Request } from '../../types/request';
import { exportRequestsToPDF } from '../../utils/export';

const MyRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRequests() {
      try {
        const data = await requestService.listMy();
        setRequests(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar solicitações');
      } finally {
        setLoading(false);
      }
    }
    loadRequests();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Minhas Solicitações</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => exportRequestsToPDF(requests, "Minhas Solicitações - RequestFlow")} 
            className="btn btn-outline"
            disabled={requests.length === 0}
          >
            Exportar PDF
          </button>
          <Link to="/requests/new" className="btn btn-primary">Nova Solicitação</Link>
        </div>
      </header>

      {requests.length === 0 ? (
        <EmptyState message="Você ainda não criou nenhuma solicitação." />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Categoria</th>
                <th>Prioridade</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>#{req.id}</td>
                  <td>{req.title}</td>
                  <td>{req.category_name}</td>
                  <td><PriorityBadge priority={req.priority} /></td>
                  <td><StatusBadge status={req.status} /></td>
                  <td>{new Date(req.created_at).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/requests/${req.id}`} className="btn btn-outline btn-sm">Detalhes</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
