// src/frontend/services/api/BalanceApiClient.js
import axios from "axios";
// Certifique-se que esse caminho existe, senão comente a linha abaixo e use um ID fixo
// import { getCurrentUserId } from "../health/healthService.js"; 

// CORREÇÃO: Removemos o "/v1" daqui para bater com o seu Backend atual
const BACKEND_API_BASE_URL = "http://localhost:3001/api"; 

/**
 * Task HU1-5: Consulta o saldo atualizado do usuário.
 * @returns {Promise<number>} Retorna apenas o valor numérico do saldo
 */
export async function getUserBalance() {
  // Se a função getCurrentUserId não existir ou der erro, usa um ID genérico "1"
  // Certifique-se que no seu banco de dados existe um usuário com user_id = 1
  const userId = "1";
  
  const url = `${BACKEND_API_BASE_URL}/users/${userId}/balance`;

  try {
    console.log(`[BalanceApiClient] Buscando saldo atualizado para ${userId}...`);
    console.log(`[BalanceApiClient] URL: ${url}`); // Log para conferir a URL final

    const res = await axios.get(url);
    
    // AJUSTE IMPORTANTE:
    // O backend retorna { balance: 150.00 }
    const saldo = res.data.balance !== undefined ? res.data.balance : res.data;
    
    return parseFloat(saldo); // Garante que retorna um número

  } catch (err) {
    console.error("[BalanceApiClient] Erro ao buscar saldo:", err.message);
    
    // Retorna 0 em caso de erro para não quebrar a tela, 
    // ou mantenha seu valor de teste se preferir.
    return 0; 
  }
}