import { Pool } from 'pg';

/*
 * Conexão com o banco de dados PostgreSQL usando um pool de conexões
 * fornecido pelo pacote 'pg'.
 
 
 * Contrato / uso:
 * - Variáveis de ambiente (obrigatórias/esperadas):
 *   DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT
 * - Exporta a função `query(text, params)` que replica a API do pool
 *   (`pool.query`) e retorna uma Promise com o resultado da consulta.
 

 * Observações de robustez:
 * - `DB_PORT` pode vir como string; aqui fazemos parse para número
 *   e usamos 5432 como fallback padrão.
 * - Erros de conexão/consulta são propagados ao chamador para que
 *   as rotas/serviços possam tratá-los (retry/log/etc.).
 */

const pool = new Pool({
    
    user: process.env.DB_USER,  // usuário do banco (ex.: 'postgres' ou usuário da aplicação)
    host: process.env.DB_HOST, // host do banco (ex.: 'localhost' ou endereço do serviço)
    database: process.env.DB_NAME, // nome do banco de dados
    password: process.env.DB_PASSWORD, // senha do usuário do banco
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432, // porta do PostgreSQL
});

/**
 * query(text, params?): Promise
 *
 * Wrapper simples em cima de `pool.query` para manter um ponto único
 * de acesso ao banco na aplicação. Recebe SQL/texto e parâmetros
 * (quando usarem prepared statements) e retorna a Promise do driver.
 *
 * Exemplos:
 *   const res = await query('SELECT * FROM users WHERE id = $1', [id]);
 *   const rows = res.rows;
 *
 * Erros (ex.: credenciais inválidas, timeout) são lançados e devem ser
 * tratados pelo chamador (try/catch em rotas ou middleware de erro).
 */


// Exporta uma função utilitária para executar consultas SQL
export const query = (text, params) => pool.query(text, params);
