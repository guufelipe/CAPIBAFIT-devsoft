-- ===============================================
-- TABELA: users (COMPLETA para o cadastro)
-- ===============================================
CREATE TABLE users (
    -- ID único do usuário
    user_id SERIAL PRIMARY KEY, -- Usando SERIAL, se estiver usando no código

    -- Colunas de Cadastro (obrigatórias para o endpoint /register)
    name VARCHAR(255) NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    -- Informações de Saúde/Meta
    height DECIMAL(3, 2), 
    weight DECIMAL(5, 2),
    goal VARCHAR(255),

    -- Saldo total de Capibas do usuário
    capiba_balance INTEGER NOT NULL DEFAULT 0,

    -- Data da última atividade registrada
    last_activity_date DATE,

    -- Contagem de dias consecutivos de atividade
    current_streak_count INTEGER NOT NULL DEFAULT 0,

    -- Flag do Desafio de Boas-Vindas (F = não completado, S = completado)
    welcome_challenge_completed CHAR(1) NOT NULL DEFAULT 'N', -- Usando 'N' como default

    -- Metadados
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ===============================================
-- TABELA: transactions (CORRIGIDA E SINCRONIZADA)
-- ===============================================
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,

    -- FK para o usuário que recebeu esta transação
    user_id INTEGER REFERENCES users(user_id) NOT NULL, -- Assumindo INTEGER para FK se user_id for SERIAL

    -- Quantidade de Capibas creditada (capiba_amount no seu código)
    capiba_amount INTEGER NOT NULL, -- CORRIGIDO o nome da coluna

    -- Tipo da Transação (credit/debit - ESSENCIAL para evitar o erro NOT NULL)
    transaction_type VARCHAR(50) NOT NULL, -- NOVO/CORRIGIDO

    -- Tipo da atividade ('welcome_challenge', 'daily_activity', etc.)
    activity_type VARCHAR(255) NOT NULL,

    -- Origem da bonificação (para rastrear bônus)
    bonus_origin VARCHAR(50),

    -- Detalhes adicionais (ex: "Bônus de 60 Capibas" ou "Corrida - 5.2km")
    activity_details VARCHAR(255), 
    
    -- Data e hora da transação (transaction_date no seu BD)
    transaction_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- CORRIGIDO o nome da coluna

    -- Coluna de referência externa (para integração futura com API externa)
    external_ref_id VARCHAR(255) 

    -- A coluna 'created_at' e 'date_time' foram substituídas/removidas para simplificar e alinhar
);