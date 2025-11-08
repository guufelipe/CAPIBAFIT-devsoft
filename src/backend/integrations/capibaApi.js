import axios from 'axios';

/* Objetivo:
 * - Fornecer uma função simples que solicita o crédito (em 'capibas') para
 *   um usuário, registrando a origem/descrição da ação.
 *
 * Configuração por variáveis de ambiente:
 * - CAPIBA_CREDIT_URL: URL base do endpoint que processa créditos (ex.: https://api.prefeitura/...)
 *   Se não informada, usa o fallback 'http://capiba.prefeitura.api/credit' presente abaixo
 *   (recomenda-se configurar explicitamente em cada ambiente).
 * - CAPIBA_API_KEY: chave/secret usada para autenticação (Bearer token neste código).
 *
 * Notas de segurança e operação:
 * - Não deixe a chave em código-fonte; use secrets manager/variáveis de ambiente.
 * - Em produção, restrinja o acesso desse token e rotacione quando necessário.
 * - Considere usar HTTPS na URL da API e validar certificados.
 */

// Variáveis de ambiente para configuração do endpoint e credenciais
const CAPIBA_API_URL = process.env.CAPIBA_CREDIT_URL || 'http://capiba.prefeitura.api/credit';
const API_KEY = process.env.CAPIBA_API_KEY;

/**
 * requestCapibaCredit
 * -------------------
 * Envia uma solicitação para creditar 'capibas' ao usuário identificado.
 *
 * Parâmetros:
 * - userId {string}: identificador do usuário dentro do sistema local.
 * - capibasAmount {number}: quantidade a creditar (valor inteiro esperado pela API).
 * - activityDetails {string}: descrição/metadata da atividade (p.ex. "caminhada 5km")
 *
 * Retorno:
 * - Promise que resolve para um objeto { success: boolean, data?: object, error?: any }
 *   - success: true quando a API confirmou o crédito (HTTP 2xx)
 *   - data: payload de resposta da API quando sucesso
 *   - error: informação retornada ou lançada quando falha
 *
 * Observações de implementação:
 * - A função usa `axios.post` diretamente; em aplicações maiores é comum criar
 *   um `axios` instance com timeout, interceptors e logs.
 * - Erros de rede ou respostas 4xx/5xx são capturados e retornados no formato
 *   { success: false, error } — o chamador deve tratar e transformar em resposta
 *   HTTP adequada na camada de rota.
 */
export async function requestCapibaCredit(userId, capibasAmount, activityDetails) {
    // Checagem rápida da credencial: sem chave, não podemos autenticar
    if (!API_KEY) {
        // Em ambientes controlados, prefira falhar rápido e detectar configuração ausente
        console.error("ERRO: CAPIBA_API_KEY não configurada. A transação não pode prosseguir.");
        return { success: false, error: "Authentication credentials missing." };
    }

    // Payload conforme contrato da API Capiba. Nomes de campos devem seguir
    // o que a API espera (aqui usamos snake_case como exemplo).
    const payload = {
        user_id: userId,
        amount: capibasAmount,
        action_type: "ATIVIDADE_FISICA", // Código da ação Capiba (conforme guia da API)
        details: activityDetails
    };

    try {
        // Requisição HTTP para endpoint central de créditos.
        // Headers: Authorization como Bearer token e Content-Type JSON.
        const response = await axios.post(CAPIBA_API_URL, payload, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        // Sucesso: retornamos o body para o chamador (possibilitando log/resposta)
        return { success: true, data: response.data };

    } catch (error) {
        // Normalizar mensagem de erro: se o erro vier com resposta do servidor,
        // preferimos o corpo (que pode conter código/mensagem útil). Caso contrário,
        // usamos a mensagem do próprio erro (timeout, DNS, etc.).
        const errorMessage = error.response ? error.response.data : error.message;
        console.error("Falha ao solicitar crédito na API da Prefeitura:", errorMessage);

        // Retornamos o erro para que a camada superior decida se faz retry, rollback,
        // ou retorna um 5xx ao cliente.
        return { success: false, error: errorMessage };
    }
}