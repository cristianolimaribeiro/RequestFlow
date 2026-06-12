SET client_encoding = 'UTF8';

-- Criar tabelas com prefixo rf_

-- Usuarios
CREATE TABLE IF NOT EXISTS rf_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'approver', 'requester')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categorias
CREATE TABLE IF NOT EXISTS rf_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Solicitacoes
CREATE TABLE IF NOT EXISTS rf_requests (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER REFERENCES rf_categories(id),
    requester_id INTEGER REFERENCES rf_users(id),
    approver_id INTEGER REFERENCES rf_users(id),
    status VARCHAR(20) DEFAULT 'aberta' CHECK (status IN ('aberta', 'em_analise', 'aprovada', 'reprovada', 'cancelada', 'concluida')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('baixa', 'media', 'alta', 'critica')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Historico da solicitacao
CREATE TABLE IF NOT EXISTS rf_request_history (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES rf_requests(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES rf_users(id),
    action VARCHAR(100) NOT NULL,
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices basicos para performance
CREATE INDEX IF NOT EXISTS idx_rf_requests_requester ON rf_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_rf_requests_status ON rf_requests(status);
CREATE INDEX IF NOT EXISTS idx_rf_history_request ON rf_request_history(request_id);

-- Anexos das solicitações
CREATE TABLE IF NOT EXISTS rf_attachments (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES rf_requests(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES rf_users(id),
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_data BYTEA NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rf_attachments_request ON rf_attachments(request_id);
