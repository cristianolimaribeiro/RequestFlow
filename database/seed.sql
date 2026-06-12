SET client_encoding = 'UTF8';

-- Inserir categorias iniciais
INSERT INTO rf_categories (name, description) VALUES 
('Hardware', 'Solicitações relacionadas a computadores, periféricos e componentes físicos'),
('Software', 'Instalação de programas, licenças e acessos a sistemas'),
('Acessos', 'Criação de usuários, permissões de pastas e acessos de rede'),
('Infraestrutura', 'Rede, telefonia, internet e mobiliário'),
('Suporte Técnico', 'Dúvidas gerais e problemas de funcionamento');

-- Inserir usuários iniciais (Senha: 123456)
-- Hash gerado via bcryptjs com 10 rounds
INSERT INTO rf_users (name, email, password_hash, role) VALUES 
('Administrador Sistema', 'admin@requestflow.com', '$2a$10$xCOA2/kZctXh5NCHNWzAOOiTbpdBpVTN5YmXMU6IBWNNTF.dZkYyO', 'admin'),
('Aprovador TI', 'aprovador@requestflow.com', '$2a$10$xCOA2/kZctXh5NCHNWzAOOiTbpdBpVTN5YmXMU6IBWNNTF.dZkYyO', 'approver'),
('Usuario Comum', 'usuario@requestflow.com', '$2a$10$xCOA2/kZctXh5NCHNWzAOOiTbpdBpVTN5YmXMU6IBWNNTF.dZkYyO', 'requester');

-- Inserir solicitações iniciais para teste
INSERT INTO rf_requests (title, description, category_id, requester_id, priority, status) VALUES 
('Notebook com tela azul', 'Meu computador não liga e apresenta tela azul ao iniciar.', 1, 3, 'alta', 'aberta'),
('Acesso ao SAP', 'Solicito acesso ao módulo financeiro do SAP.', 3, 3, 'media', 'em_analise'),
('Instalação do Photoshop', 'Necessário para edição de imagens da campanha.', 2, 3, 'baixa', 'aprovada');

-- Inserir histórico inicial
INSERT INTO rf_request_history (request_id, user_id, action, old_status, new_status, comment) VALUES 
(1, 3, 'Criação da solicitação', NULL, 'aberta', 'Solicitação aberta pelo sistema'),
(2, 2, 'Início da análise', 'aberta', 'em_analise', 'Analisando perfil de acesso necessário'),
(3, 2, 'Aprovação concedida', 'em_analise', 'aprovada', 'Aprovado conforme política interna');
