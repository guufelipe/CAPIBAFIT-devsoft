// src/frontend/services/api/BalanceApiClient.js
import axios from "axios";
// Certifique-se que esse caminho existe, senão comente a linha abaixo e use um ID fixo
import { getCurrentUserId } from "../health/healthService.js"; 

const BACKEND_API_BASE_URL =
  "http://localhost:3001/api/v1"; // Use a hardcoded URL or inject via build tools if needed

/**
 * Task HU1-5: Consulta o saldo atualizado do usuário.
 * @returns {Promise<number>} Retorna apenas o valor numérico do saldo
 */
export async function getUserBalance() {
  // Se a função getCurrentUserId não existir ou der erro, usa um ID genérico "1"
  const userId = typeof getCurrentUserId === 'function' ? getCurrentUserId() : "1";
  
  const url = `${BACKEND_API_BASE_URL}/users/${userId}/balance`;

  try {
    console.log(`[BalanceApiClient] Buscando saldo atualizado para ${userId}...`);
    const res = await axios.get(url);
    
    // AJUSTE IMPORTANTE:
    // Se o backend retorna { balance: 150 }, nós pegamos apenas o .balance
    // Se por acaso a API retornar direto o número, usamos res.data
    const saldo = res.data.balance !== undefined ? res.data.balance : res.data;
    
    return saldo; 

  } catch (err) {
    console.error("[BalanceApiClient] Erro ao buscar saldo:", err.message);
    
    // MODO DE SEGURANÇA:
    // Retorna o valor fixo (820) para a tela não quebrar enquanto você não sobe o backend
    return 567; 
  }
}