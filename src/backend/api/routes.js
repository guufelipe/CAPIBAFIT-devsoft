// src/backend/api/routes.js
//
// Definição de rotas HTTP para as funcionalidades de pontuação/consulta de
// transações (capibas). Este arquivo registra handlers Express que recebem
// requisições do frontend e delegam lógica pesada para os serviços apropriados.

import express from 'express';
import { query } from '../database/db_connection';
import { processAndCreditActivity } from '../services/rewardEngine';

const router = express.Router();


// ------------------------------------------------------------------
// Payload esperado (JSON): { userId, distanceKm, timeMinutes, activityType }
// Respostas:
// - 202 Accepted: quando o processamento foi iniciado/completo com sucesso
// - 400 Bad Request: dados faltantes ou processamento rejeitado pela validação
//
router.post('/activities/sync', async (req, res) => {
    // Extrai dados enviados pelo cliente
    const { userId, distanceKm, timeMinutes, activityType } = req.body;

    // Validação básica de presença de campos (camada superior pode aplicar validações adicionais)
    if (!userId || !distanceKm || !timeMinutes || !activityType) {
        return res.status(400).json({ error: "Dados de atividade incompletos." });
    }

    // Delegamos o processamento (validação anti-fraude, cálculo e chamada à API externa)
    // ao serviço de domínio. Nota: no desenho ideal essa chamada seria enfileirada.
    const result = await processAndCreditActivity(userId, distanceKm, timeMinutes, activityType);

    if (result.success) {
        // 202 indica aceitação/processamento; inclui quantas capibas foram creditadas.
        return res.status(202).json({ 
            message: "Atividade recebida. Crédito em processamento.",
            credited: result.credited
        });
    } else {
        // Erros de validação/negócio retornam 400 com mensagem explicativa
        return res.status(400).json({ error: result.message });
    }
});

// ------------------------------------------------------------------
// Rota: GET /users/:userId/transactions
// Responsabilidade:
// - Recuperar o extrato de transações (últimas N entradas) do usuário.
// - Usa consulta SQL parametrizada para evitar SQL injection.

//
// Parâmetros de rota: userId
// Respostas:
// - 200 OK: { transactions: [...] }
// - 500 Internal Server Error: quando ocorre problema ao consultar o banco
//
router.get('/users/:userId/transactions', async (req, res) => {
    const userId = req.params.userId;

    // Query parametrizada: seleciona campos relevantes para o extrato que o frontend espera
    const sqlQuery = `
        SELECT 
            amount_capiba AS valor, 
            date_time AS data, 
            activity_type AS origem, 
            activity_details AS detalhes
        FROM transactions
        WHERE user_id = $1
        ORDER BY date_time DESC
        LIMIT 20; 
    `;

    try {
        // Executa a query com o pool de conexões e retorna as linhas ao cliente
        const { rows } = await query(sqlQuery, [userId]);

        return res.status(200).json({ transactions: rows });
    } catch (error) {
            // Log básico de erro; em produção use logger estruturado
        console.error("Erro ao buscar extrato:", error);
        return res.status(500).json({ error: "Erro interno ao buscar transações." });
    }
});

export default router;