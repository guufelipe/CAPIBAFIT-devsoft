// src/backend/services/rewardEngine.js 

import { requestCapibaCredit } from '../integrations/capibaApi.js';
import { query } from '../database/db_connection.js';
import { TRANSACTION_CONSTANTS } from '../constants/transactionConstants.js'; // Importa as constantes

const CAPIBA_FACTOR = Number(process.env.CAPIBA_PER_KM) || 30; // capibas por km
const MAX_SPEED_KPH = 25;

// Cálculo normal de capibas
export function calculateCapibas(distanceKm) {
    return Math.floor(distanceKm * CAPIBA_FACTOR);
}

// Validação anti-fraude
function validateActivity(distanceKm, timeMinutes) {
    if (distanceKm < 0.1 || timeMinutes < 1) return false;

    const speedKPH = distanceKm / (timeMinutes / 60);
    if (speedKPH > MAX_SPEED_KPH) return false;

    return true;
}

// Processa atividade normal (Sem alterações significativas para esta task)
export async function processAndCreditActivity(userId, distanceKm, timeMinutes, activityType) {
    if (!validateActivity(distanceKm, timeMinutes)) {
        return { success: false, message: "Atividade rejeitada por fraude." };
    }

    const capibasToCredit = calculateCapibas(distanceKm);
    const details = `${distanceKm.toFixed(2)} km, ${timeMinutes} min`;

    const creditResult = await requestCapibaCredit(userId, capibasToCredit, details);

    if (!creditResult.success) {
        return { success: false, message: "Falha ao comunicar com API externa." };
    }
    
    // Define o tipo de transação como 'credit' (crédito) para atividade normal
    const TRANSACTION_TYPE = TRANSACTION_CONSTANTS.TRANSACTION_TYPES.CREDIT;

    // registra transação interna
    await query(
        // Adicionado transaction_type aqui também, caso ele seja NOT NULL em ambas as inserções
        `INSERT INTO transactions 
         (user_id, capiba_amount, transaction_type, activity_type, activity_details, external_ref_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
            userId,
            capibasToCredit,
            TRANSACTION_TYPE, // Adicionado
            activityType,
            details,
            creditResult.data?.transaction_id || null
        ]
    );

    // atualiza saldo interno
    await query(
        `UPDATE users SET capiba_balance = capiba_balance + $1 WHERE user_id = $2`,
        [capibasToCredit, userId]
    );

    return { success: true, credited: capibasToCredit, details };
}


// Task 4 — Bônus do desafio de boas-vindas (Implementação final, corrigindo o erro NOT NULL)
export async function grantWelcomeSignupBonus(userId) {
    const BONUS = 50; 
    const { ACTIVITY_TYPES, ACTIVITY_DETAILS, BONUS_ORIGINS, TRANSACTION_TYPES } = TRANSACTION_CONSTANTS; 

    try {
        // registra transação (Task 4)
        await query(
            // CORRIGIDO: Adicionada a coluna transaction_type (Tipo: 'credit')
            `INSERT INTO transactions 
             (user_id, capiba_amount, transaction_type, activity_type, activity_details, bonus_origin) 
             VALUES ($1, $2, $3, $4, $5, $6)`, 
            [
                userId, 
                BONUS,
                TRANSACTION_TYPES.CREDIT,             // $3: 'credit' (Corrigindo o erro de NOT NULL)
                ACTIVITY_TYPES.WELCOME_CHALLENGE,     // $4: 'welcome_challenge'
                ACTIVITY_DETAILS.WELCOME_BONUS,       // $5: 'Bônus de 50 Capibas'
                BONUS_ORIGINS.WELCOME_CHALLENGE       // $6: 'welcome_challenge'
            ]
        );

        // atualiza saldo E MARCA A FLAG welcome_challenge_completed para 'S'
        await query(
            `UPDATE users SET capiba_balance = capiba_balance + $1, welcome_challenge_completed = 'S' WHERE user_id = $2`,
            [BONUS, userId]
        );

        console.log(`Bônus de desafio de boas-vindas concedido ao usuário ${userId}`);

    } catch (error) {
        console.error("Erro ao dar bônus de desafio de boas-vindas:", error);
        throw error;
    }
}