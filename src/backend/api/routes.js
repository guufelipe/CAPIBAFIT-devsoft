import express from 'express';
import { query } from '../database/db_connection.js'; // Verifique se o caminho '../' está certo para sua pasta
import { addActivityToQueue } from '../services/QueueService.js';
import { WelcomeBonusService } from "../services/WelcomeBonusService.js";

const router = express.Router();

// ==================================================================
// REGRAS DE ROTAS (LEIA ISTO):
// O seu server.js já adiciona o prefixo "/api".
// Portanto, aqui nós NÃO colocamos "/api" e nem "/v1" (pois seu front não manda v1).
// ==================================================================

// URL FINAL: POST http://localhost:3001/api/activities/sync
router.post('/activities/sync', async (req, res) => {
    // LOG DE DEBUG: Isso vai aparecer no terminal do servidor quando o front chamar
    console.log("Recebi POST em /activities/sync"); 
    console.log("Body recebido:", req.body);

    const { userId, distanceKm, timeMinutes, activityType } = req.body;

    if (!userId || !distanceKm || !timeMinutes || !activityType) {
        return res.status(400).json({ error: "Dados de atividade incompletos." });
    }

    try {
        await addActivityToQueue({ userId, distanceKm, timeMinutes, activityType });
        return res.status(202).json({
            message: "Atividade recebida e encaminhada para processamento."
        });
    } catch (error) {
        console.error("Erro ao enfileirar:", error);
        return res.status(500).json({ error: "Erro interno ao enfileirar a atividade." });
    }
});

// URL FINAL: GET http://localhost:3001/api/users/:userId/transactions
router.get('/users/:userId/transactions', async (req, res) => {
    const userId = req.params.userId;
    // ... (seu código de extrato) ...
    const sqlQuery = `SELECT amount_capiba AS valor, date_time AS data, activity_type AS origem, activity_details AS detalhes FROM transactions WHERE user_id = $1 ORDER BY date_time DESC LIMIT 20;`;
    
    try {
        const { rows } = await query(sqlQuery, [userId]);
        return res.status(200).json({ transactions: rows });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar transações." });
    }
});

// URL FINAL: GET http://localhost:3001/api/users/:userId/balance
router.get('/users/:userId/balance', async (req, res) => {
    const userId = req.params.userId;
    // ... (seu código de saldo) ...
    const sql = `SELECT capiba_balance AS balance FROM users WHERE user_id = $1 LIMIT 1;`;

    try {
        const { rows } = await query(sql, [userId]);
        if (!rows.length) return res.status(404).json({ error: "Usuário não encontrado." });
        return res.status(200).json({ balance: parseFloat(rows[0].balance) });
    } catch (error) {
        return res.status(500).json({ error: "Erro interno." });
    }
});

export default router;