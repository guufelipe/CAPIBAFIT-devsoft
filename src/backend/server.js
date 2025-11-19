import dotenv from 'dotenv';
dotenv.config(); //  Carrega as variáveis .env

console.log("DEBUG ENV:", {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT
});  // Testando pra ver se as variáveis de ambiente estão carregando corretamente

console.log("TIPOS:", {
  DB_USER: typeof process.env.DB_USER,
  DB_PASSWORD: typeof process.env.DB_PASSWORD,
  RAW_PASSWORD: process.env.DB_PASSWORD,
});


import express from 'express';
import cors from 'cors'; //  PRECISAMOS DELE PARA O FRONT-END
import apiRouter from './api/routes.js';


import { query } from './database/db_connection.js';

async function testDatabaseConnection() {
  try {
    await query('SELECT 1');
    console.log('💾 Conectado ao PostgreSQL com sucesso.');
  } catch (err) {
    console.error('❌ ERRO ao conectar ao PostgreSQL:', err);
  }
}
// Testa a conexão com o banco ao iniciar o servidor


// --- CONFIGURAÇÕES DO SERVIDOR ---
const app = express();
const PORT = 3001; // Porta do seu BACK-END
const FRONTEND_URL = 'http://localhost:5173'; // URL do seu FRONT-END React

// -----------------------------------------------------------------
// 1. CONFIGURAÇÃO DE MIDDLEWARE
// -----------------------------------------------------------------

// Middleware CORS: Permite que o frontend (React) acesse o backend
app.use(cors({
    origin: FRONTEND_URL, // Permite requisições apenas desta URL (seu React)
    methods: ['GET', 'POST'], // Permite os métodos usados
    credentials: true
}));


app.use(express.json({ limit: '10mb' })); // Assim evita erros como "Payload Too Large" quando mandam dados grandes.

// Middleware JSON: Permite que o Express leia o JSON enviado no corpo da requisição POST
app.use(express.json());




// -----------------------------------------------------------------
// 2. REGISTRO DAS ROTAS
// -----------------------------------------------------------------

// Monta todas as rotas definidas em routes.js sob o prefixo /api
app.use('/api', apiRouter); 

// Rota de saúde básica para checagem se o servidor está rodando
app.get('/health', (req, res) => res.json({ ok: true }));

// -----------------------------------------------------------------
// 3. INICIALIZAÇÃO DO SERVIDOR
// -----------------------------------------------------------------
app.listen(PORT, async () => {
    console.log(`🚀 Servidor Express rodando na porta ${PORT}`);
    console.log(`Aguardando requisições de ${FRONTEND_URL}`);

    await testDatabaseConnection();
});