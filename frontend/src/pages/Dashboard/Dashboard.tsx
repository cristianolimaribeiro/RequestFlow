import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import Loading from '../../components/Loading/Loading';
import ErrorState from '../../components/ErrorState/ErrorState';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge/PriorityBadge';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import './Dashboard.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dashboard');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  const { counters, recent, byCategory, byPriority } = stats;

  return (
    <div className="dashboard">
      <header className="page-header">
        <h1>Dashboard</h1>
        <Link to="/requests/new" className="btn btn-primary">Nova Solicitação</Link>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{counters.total}</p>
        </div>
        <div className="stat-card info">
          <h3>Abertas</h3>
          <p>{counters.abertas}</p>
        </div>
        <div className="stat-card warning">
          <h3>Em Análise</h3>
          <p>{counters.em_analise}</p>
        </div>
        <div className="stat-card success">
          <h3>Aprovadas</h3>
          <p>{counters.aprovadas}</p>
        </div>
        <div className="stat-card danger">
          <h3>Reprovadas</h3>
          <p>{counters.reprovadas}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <h3>Solicitações por Categoria</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory}>
                <CartesianGrid vertical={false} stroke="var(--border-light)" />
                <XAxis dataKey="name" tick={{fill: 'var(--text-secondary)'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: 'var(--text-secondary)'}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'var(--bg-hover)'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-soft)', background: 'var(--bg-surface)', color: 'var(--text-main)' }} />
                <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <h3>Solicitações por Prioridade</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byPriority}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {byPriority.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <section className="recent-requests">
        <div className="section-header">
          <h2>Solicitações Recentes</h2>
          <Link to="/my-requests" className="link">Ver todas</Link>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Categoria</th>
                <th>Prioridade</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((req: any) => (
                <tr key={req.id}>
                  <td>#{req.id}</td>
                  <td>{req.title}</td>
                  <td>{req.category_name}</td>
                  <td><PriorityBadge priority={req.priority} /></td>
                  <td><StatusBadge status={req.status} /></td>
                  <td>
                    <Link to={`/requests/${req.id}`} className="btn btn-outline btn-sm">Detalhes</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
