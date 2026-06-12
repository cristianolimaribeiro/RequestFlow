import React, { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types/category';
import Loading from '../../components/Loading/Loading';
import ErrorState from '../../components/ErrorState/ErrorState';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await categoryService.list();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    try {
      await categoryService.create({ name: newName, description: newDesc });
      setNewName('');
      setNewDesc('');
      loadCategories();
    } catch (err) {
      alert('Erro ao criar categoria');
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await categoryService.toggleActive(id);
      loadCategories();
    } catch (err) {
      alert('Erro ao alterar status da categoria');
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Gestão de Categorias</h1>
      </header>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Nova Categoria</h3>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '1rem', marginTop: '1rem', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Nome</label>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} required />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Descrição</label>
            <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary">Adicionar</button>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>#{c.id}</td>
                <td><strong>{c.name}</strong></td>
                <td>{c.description}</td>
                <td>
                  <span className={`badge ${c.active ? 'bg-success' : 'bg-danger'}`}>
                    {c.active ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => handleToggleActive(c.id)} 
                    className={`btn btn-sm ${c.active ? 'btn-danger' : 'btn-success'}`}
                    style={{ minWidth: '100px' }}
                  >
                    {c.active ? 'Desativar' : 'Ativar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
