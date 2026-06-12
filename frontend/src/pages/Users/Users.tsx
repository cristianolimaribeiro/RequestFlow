import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { User } from '../../types/user';
import Loading from '../../components/Loading/Loading';
import ErrorState from '../../components/ErrorState/ErrorState';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await userService.list();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }

  const handleToggleActive = async (id: number) => {
    try {
      await userService.toggleActive(id);
      loadUsers();
    } catch (err) {
      alert('Erro ao alterar status do usuário');
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Gestão de Usuários</h1>
      </header>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className="badge bg-secondary">{u.role}</span></td>
                <td>
                  <span className={`badge ${u.active ? 'bg-success' : 'bg-danger'}`}>
                    {u.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => handleToggleActive(u.id)} 
                    className={`btn btn-sm ${u.active ? 'btn-danger' : 'btn-success'}`}
                    style={{ minWidth: '100px' }}
                  >
                    {u.active ? 'Desativar' : 'Ativar'}
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

export default Users;
