-- Remover tabelas com prefixo rf_ na ordem correta devido as FKs
DROP TABLE IF EXISTS rf_attachments;
DROP TABLE IF EXISTS rf_request_history;
DROP TABLE IF EXISTS rf_requests;
DROP TABLE IF EXISTS rf_categories;
DROP TABLE IF EXISTS rf_users;
