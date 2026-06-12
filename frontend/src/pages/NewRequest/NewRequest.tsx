import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../../services/requestService';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types/category';
import ErrorState from '../../components/ErrorState/ErrorState';

const NewRequest: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState('media');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await categoryService.list();
        setCategories(data.filter(c => c.active));
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await requestService.create({
        title,
        description,
        category_id: parseInt(categoryId),
        priority
      });
      navigate('/my-requests');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Nova Solicitação</h1>
      </header>

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          {error && <ErrorState message={error} />}
          
          <div className="form-group">
            <label>Título</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              placeholder="Ex: Teclado não funciona"
            />
          </div>

          <div className="form-group">
            <label>Categoria</label>
            <select 
              value={categoryId} 
              onChange={(e) => setCategoryId(e.target.value)} 
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Prioridade</label>
            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value)} 
              required
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              rows={5}
              placeholder="Descreva detalhadamente o problema ou necessidade..."
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
            ></textarea>
          </div>

          <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Enviando...' : 'Criar Solicitação'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">
              Cancelar
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: white;
        }
      `}</style>
    </div>
  );
};

export default NewRequest;
