import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { requestService } from '../../services/requestService';
import { Request } from '../../types/request';
import Loading from '../../components/Loading/Loading';
import ErrorState from '../../components/ErrorState/ErrorState';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge/PriorityBadge';
import { useAuth } from '../../contexts/AuthContext';

const RequestDetails: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadRequest();
  }, [id]);

  async function loadRequest() {
    try {
      const data = await requestService.getById(parseInt(id!));
      setRequest(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar detalhes');
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Arquivo muito grande (máximo 2MB)');
      return;
    }

    setActionLoading(true);
    try {
      await requestService.uploadAttachment(request!.id, file);
      setFile(null);
      await loadRequest();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao enviar arquivo');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAction = async (action: 'analyze' | 'approve' | 'reject' | 'cancel' | 'complete') => {
    if ((action === 'reject') && !comment) {
      alert('Comentário é obrigatório para reprovação');
      return;
    }

    setActionLoading(true);
    try {
      if (action === 'analyze') await requestService.analyze(request!.id);
      if (action === 'approve') await requestService.approve(request!.id, comment);
      if (action === 'reject') await requestService.reject(request!.id, comment);
      if (action === 'cancel') await requestService.cancel(request!.id);
      if (action === 'complete') await requestService.complete(request!.id);
      
      setComment('');
      await loadRequest();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao processar ação');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;
  if (!request) return <ErrorState message="Solicitação não encontrada" />;

  const isRequester = user?.id === request.requester_id;
  const isApprover = user?.role === 'admin' || user?.role === 'approver';

  return (
    <div className="request-details">
      <header className="page-header">
        <h1>Solicitação #{request.id}</h1>
        <button onClick={() => navigate(-1)} className="btn btn-outline">Voltar</button>
      </header>

      <div className="details-grid">
        <div className="card info-section">
          <h2>{request.title}</h2>
          <div className="badge-group">
            <StatusBadge status={request.status} />
            <PriorityBadge priority={request.priority} />
          </div>
          
          <div className="meta-info">
            <p><strong>Solicitante:</strong> {request.requester_name}</p>
            <p><strong>Categoria:</strong> {request.category_name}</p>
            <p><strong>Data:</strong> {new Date(request.created_at).toLocaleString()}</p>
            {request.approver_name && <p><strong>Aprovador:</strong> {request.approver_name}</p>}
            {request.completed_at && <p><strong>Concluída em:</strong> {new Date(request.completed_at).toLocaleString()}</p>}
          </div>

          <div className="description">
            <h3>Descrição</h3>
            <p>{request.description}</p>
          </div>
        </div>

        <div className="card actions-section">
          <h3>Ações</h3>
          <div className="actions-buttons">
            {isRequester && request.status === 'aberta' && (
              <button onClick={() => handleAction('cancel')} disabled={actionLoading} className="btn btn-danger">Cancelar Solicitação</button>
            )}

            {isApprover && (
              <>
                {request.status === 'aberta' && (
                  <button onClick={() => handleAction('analyze')} disabled={actionLoading} className="btn btn-info">Iniciar Análise</button>
                )}
                {request.status === 'em_analise' && (
                  <>
                    <div className="comment-box">
                      <label>Comentário (Obrigatório para reprovação)</label>
                      <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3}></textarea>
                    </div>
                    <div className="btn-group">
                      <button onClick={() => handleAction('approve')} disabled={actionLoading} className="btn btn-success">Aprovar</button>
                      <button onClick={() => handleAction('reject')} disabled={actionLoading} className="btn btn-danger">Reprovar</button>
                    </div>
                  </>
                )}
                {request.status === 'aprovada' && (
                  <button onClick={() => handleAction('complete')} disabled={actionLoading} className="btn btn-primary">Marcar como Concluída</button>
                )}
              </>
            )}
            
            {(!isApprover && !isRequester) || (request.status === 'concluida' || request.status === 'cancelada' || request.status === 'reprovada') && (
              <p className="text-muted">Nenhuma ação disponível para o status atual.</p>
            )}
          </div>
        </div>

        <div className="card attachments-section">
          <h3>Anexos</h3>
          
          <form onSubmit={handleFileUpload} className="upload-form">
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
              id="file-input"
              style={{ display: 'none' }}
            />
            <label htmlFor="file-input" className="btn btn-outline btn-sm">
              {file ? file.name : 'Selecionar Arquivo'}
            </label>
            <button type="submit" disabled={!file || actionLoading} className="btn btn-primary btn-sm">
              Enviar
            </button>
          </form>

          <ul className="attachments-list">
            {request.attachments?.map((att) => (
              <li key={att.id}>
                <a 
                  href={requestService.getAttachmentUrl(request.id, att.id)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="attachment-link"
                >
                  <span className="file-icon">📄</span>
                  <div className="file-info">
                    <span className="file-name">{att.file_name}</span>
                    <span className="file-meta">{new Date(att.created_at).toLocaleDateString()}</span>
                  </div>
                </a>
              </li>
            ))}
            {(!request.attachments || request.attachments.length === 0) && (
              <p className="text-muted" style={{ marginTop: '1rem', fontSize: '0.875rem' }}>Nenhum anexo enviado.</p>
            )}
          </ul>
        </div>

        <div className="card history-section">
          <h3>Histórico de Movimentações</h3>
          <ul className="history-list">
            {request.history?.map((h) => (
              <li key={h.id}>
                <div className="history-header">
                  <strong>{h.action}</strong>
                  <span>{new Date(h.created_at).toLocaleString()}</span>
                </div>
                <p>Por: {h.user_name}</p>
                {h.comment && <p className="history-comment">"{h.comment}"</p>}
                <div className="history-status">
                  {h.old_status && <span>{h.old_status} &rarr; </span>}
                  <strong>{h.new_status}</strong>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        .details-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        .history-section { grid-column: span 2; }
        .badge-group { display: flex; gap: 0.5rem; margin: 1rem 0; }
        .meta-info { display: grid; gap: 0.5rem; margin-bottom: 1.5rem; color: var(--secondary); font-size: 0.875rem; }
        .description { padding-top: 1.5rem; border-top: 1px solid var(--border); }
        .description p { white-space: pre-wrap; }
        .actions-buttons { display: flex; flex-direction: column; gap: 1rem; }
        .comment-box textarea { width: 100%; padding: 0.5rem; border-radius: 6px; border: 1px solid var(--border); margin-top: 0.5rem; }
        .btn-group { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
        .history-list { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1rem; }
        .history-list li { padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
        .history-header { display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.25rem; }
        .history-header span { color: var(--secondary); }
        .history-comment { font-style: italic; color: var(--secondary); margin: 0.5rem 0; padding-left: 1rem; border-left: 2px solid var(--border); }
        .history-status { font-size: 0.75rem; color: var(--primary); text-transform: uppercase; }
        
        .upload-form { display: flex; gap: 0.5rem; margin-top: 1rem; align-items: center; }
        .attachments-list { list-style: none; padding: 0; margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .attachment-link { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border: 1px solid var(--border); border-radius: 8px; transition: all 0.2s; }
        .attachment-link:hover { border-color: var(--primary); background: #f8fafc; }
        .file-icon { font-size: 1.5rem; }
        .file-info { display: flex; flex-direction: column; }
        .file-name { font-size: 0.875rem; font-weight: 600; color: var(--text-main); }
        .file-meta { font-size: 0.75rem; color: var(--secondary); }

        @media (max-width: 992px) {
          .details-grid { grid-template-columns: 1fr; }
          .history-section { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
};

export default RequestDetails;
