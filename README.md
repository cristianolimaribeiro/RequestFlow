# RequestFlow - Sistema de Gestão de Solicitações Internas

O **RequestFlow** é uma aplicação corporativa moderna para gerenciamento de tickets e fluxos de trabalho internos. Desenvolvido para simular um cenário real de TI/Facilities, o sistema permite a abertura, análise, aprovação e acompanhamento de solicitações com controle de perfil de acesso (RBAC) e histórico detalhado de movimentações.

---

## 🚀 Funcionalidades

### 👥 Perfis de Usuário
- **Solicitante:** Cria solicitações, acompanha status em tempo real e pode cancelar tickets abertos.
- **Aprovador:** Gerencia a fila de solicitações, inicia análises, aprova ou reprova (com comentário obrigatório).
- **Administrador:** Possui visão total do sistema, gerencia usuários, categorias e acessa o dashboard de indicadores gerais.

### 🛠️ Principais Recursos
- **Dashboard Corporativo:** Visão geral de métricas com gráficos dinâmicos (Pizza e Barras usando Recharts).
- **Gestão de Anexos:** Suporte para upload e download de arquivos (até 2MB) salvos diretamente no banco de dados.
- **Exportação de Relatórios:** Geração de arquivos PDF das listagens de solicitações (via jsPDF).
- **Fluxo de Aprovação:** Máquina de estados robusta (Aberta -> Em Análise -> Aprovada/Reprovada -> Concluída).
- **Histórico Completo:** Cada mudança de status ou comentário é registrado para auditoria.
- **Interface Responsiva:** Otimizada para Desktop e Dispositivos Móveis com menu lateral adaptativo.
- **Segurança:** Autenticação via JWT, proteção de rotas no frontend e backend, e senhas criptografadas com Bcrypt.

---

## 🧪 Stack Técnica

- **Frontend:** React, TypeScript, Vite, React Router, Context API, Recharts (Gráficos), jsPDF, CSS puro (Modern Corporate Design).
- **Backend:** Node.js, Express, TypeScript, Multer (Upload de arquivos).
- **Banco de Dados:** PostgreSQL (Queries SQL puras com `pg` e armazenamento BYTEA para anexos).
- **Segurança:** JSON Web Token (JWT), BcryptJS, CORS, Dotenv.
- **Deploy:** Render (Static Site, Web Service e Managed PostgreSQL).

---

## 📦 Estrutura do Projeto

```text
requestflow/
├── frontend/    # Aplicação React (Vite)
├── backend/     # API REST (Node.js/Express)
├── database/    # Scripts SQL de estrutura e dados
└── README.md    # Documentação
```

---

## 🛠️ Instalação Local

### 1. Requisitos
- Node.js v18+
- PostgreSQL v15+

### 2. Configuração do Banco de Dados
Crie um banco chamado `requestflow` e execute os scripts na ordem (atenção: agora inclui anexos):
```powershell
psql -U postgres -d requestflow -f database/schema.sql
psql -U postgres -d requestflow -f database/seed.sql
```

### 3. Configuração do Backend
Entre na pasta `backend`, instale as dependências e crie o arquivo `.env`:
```powershell
cd backend
npm install
```
`.env` do Backend:
```env
PORT=10000
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/requestflow
JWT_SECRET=sua_chave_secreta_aqui
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```
Rode o servidor: `npm run dev`

### 4. Configuração do Frontend
Entre na pasta `frontend`, instale as dependências e crie o arquivo `.env`:
```powershell
cd frontend
npm install
```
`.env` do Frontend:
```env
VITE_API_URL=http://localhost:10000/api
```
Rode a aplicação: `npm run dev`

---

## 🔐 Usuários de Teste (Senha Padrão: 123456)
- **Admin:** `admin@requestflow.com`
- **Aprovador:** `aprovador@requestflow.com`
- **Solicitante:** `usuario@requestflow.com`

---

## ☁️ Guia de Deploy no Render

### 1. Banco de Dados (Render PostgreSQL)
- No dashboard do Render, crie um novo **PostgreSQL**.
- Salve a **Internal Database URL** para o backend.
- Use a **External Database URL** localmente para rodar o `schema.sql` e `seed.sql` no banco remoto.

### 2. Backend (Render Web Service)
- **Root Directory:** `backend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Variáveis de Ambiente:** Adicione todas as do `.env` local, usando a URL interna do banco.

### 3. Frontend (Render Static Site)
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Variável de Ambiente:** `VITE_API_URL` apontando para a URL do seu backend no Render (ex: `https://api-requestflow.onrender.com/api`).

---

## 📈 Melhorias Futuras
- [ ] Notificações por e-mail via SendGrid/Nodemailer.
- [ ] Autenticação via SSO/Google.
- [ ] Filtros avançados por data e categoria nos relatórios.
- [ ] Modo escuro (Dark Mode).

---

Desenvolvido por **[Cristiano Ribeiro]** para portfólio de Desenvolvedor Pleno.
