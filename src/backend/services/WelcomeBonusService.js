// src/backend/services/WelcomeBonusService.js  ← CÓDIGO RESTAURADO (COM BÔNUS DE 50 CAPIBA FIXO)

import { query } from "../database/db_connection.js";

export const WelcomeBonusService = {

  async execute(user_id) {
    const bonusCapibas = 50; // Valor fixo original

    // 1. Verificar se usuário existe + status da flag
    const userRes = await query(
      "SELECT welcome_challenge_completed FROM users WHERE user_id = $1",
      [user_id]
    );

    if (userRes.rows.length === 0) {
      const err = new Error("Usuário não encontrado");
      err.status = 404;
      throw err;
    }

    if (userRes.rows[0].welcome_challenge_completed === "S") {
      const err = new Error("O bônus de boas-vindas já foi solicitado.");
      err.status = 400;
      throw err;
    }

    // 2. Registrar transação
    await query(
      `INSERT INTO transactions
        (user_id, capiba_amount, transaction_type, activity_type, activity_details, bonus_origin)
       VALUES ($1, $2, $3, $4, $5, $6)`, 
      [
        user_id, 
        bonusCapibas, 
        'credit', 
        'bonus', 
        'Bônus de 50 Capibas por cadastro (Task 4)', // Detalhe da transação
        'welcome_signup_fixed' 
      ]
    );

    // 3. Atualizar saldo e marcar flag
    await query(
      `UPDATE users
       SET capiba_balance = capiba_balance + $1,
           welcome_challenge_completed = 'S'
       WHERE user_id = $2`, 
      [bonusCapibas, user_id]
    );

    return { bonus: bonusCapibas };
  }
};