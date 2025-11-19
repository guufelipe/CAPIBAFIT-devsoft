import express from 'express';
import { query } from '../database/db_connection.js';
import { addActivityToQueue } from '../services/QueueService.js';

const router = express.Router();

router.post('/activities/sync', async (req, res) => {
    // Extrai dados enviados pelo cliente
    const { userId, distanceKm, timeMinutes, activityType } = req.body;

    // Validação básica de presença de campos (camada superior pode aplicar validações adicionais)
    if (!userId || !distanceKm || !timeMinutes || !activityType) {
        return res.status(400).json({ error: "Dados de atividade incompletos." });
    }

    try {
        await addActivityToQueue({ userId, distanceKm, timeMinutes, activityType });
        return res.status(202).json({ 
            message: "Atividade recebida e encaminhada para processamento de crédito."
        });

    } catch (error) {
        console.error("Erro ao enfileirar atividade:", error);
        return res.status(500).json({ error: "Erro interno ao enfileirar a atividade." });
    }
});

// Rota: GET /users/:userId/transactions
// Responsabilidade:
// - Recuperar o extrato de transações (últimas N entradas) do usuário.
// - Usa consulta SQL parametrizada para evitar SQL injection.

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

// Recupera saldo do usuário
router.get('/users/:userId/balance', async (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT balance
        FROM users
        WHERE id = $1
        LIMIT 1;
    `;

    try {
        const { rows } = await query(sql, [userId]);
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }
        return res.status(200).json({ balance: rows[0].balance });
    } catch (error) {
        console.error("Erro ao buscar saldo:", error);
        return res.status(500).json({ error: "Erro interno ao recuperar saldo." });
    }
});


export default router;