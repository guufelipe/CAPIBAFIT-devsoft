
# 🏃‍♂️ CapibaFit

Projeto educativo que converte atividade física em uma moeda virtual chamada "Capiba". Este repositório contém uma interface frontend construída com Vite + React e código de backend (lógica e integrações) em `src/backend`.

> Nota rápida: o repositório não possui um servidor Node robusto pronto para produção — o `start` no root foi ajustado para subir o frontend de desenvolvimento (Vite). O backend contém módulos e serviços, mas não há um arquivo único `index.js` na raiz.

Este repositório contém Frontend (Vite/React) e Backend (Node.js + Express + PostgreSQL).

## Como rodar (desenvolvimento)
    Antes de clonar o projeto, você precisa ter instalado:
        -Node.js
        -PostgreSQL
        -NPM / Yarn
        -dotenv

1) Instale dependências (na raiz):

```powershell
Set-Location -Path 'C:\caminho\para\devsofot-2025-2'
npm install
```

2) Iniciar o frontend (recomendado):

```powershell
npm start
```

Esse comando inicia o dev server do Vite localizado em `src/frontend` e deve abrir a aplicação em http://localhost:5173/.

Alternativas:
- Rodar apenas o frontend:

```powershell
npm --prefix src/frontend run dev
```

- Build de produção do frontend:

```powershell
npm --prefix src/frontend run build
```

## Testes

Os testes estão em `tests/` e usam Jest. Para executar:

```powershell
npm test
```

Observação: se `jest` não for encontrado, rode `npm install` primeiro para instalar dependências locais.

## Estrutura de pastas (resumida)

```
CAPIBAFIT-devsoft/
│
├── src/
│   ├── backend/
│   │   ├── api/          → Rotas Express
│   │   ├── database/     → Conexão com PostgreSQL
│   │   ├── integrations/ → APIs externas (mockadas)
│   │   ├── services/     → Reward Engine + Fila
│   │   ├── server.js     → Servidor Express
│   │   └── .env
│   │
│   └── frontend/
│       ├── src/          → Código React
│       └── services/     → Chamadas à API
│
├── tests/                → Testes Unitarios e de integração
├── package.json
├── README.md
└── docs/

```

## Observações e recomendações

- Se você pretende rodar um servidor backend localmente, sugiro criar um arquivo `src/backend/server.js` (ou `index.js`) que inicialize um app Express e exponha endpoints. Posso criar um servidor mínimo com `nodemon` para desenvolvimento e ajustar scripts para rodar frontend + backend em paralelo.
- Para desenvolvimento simultâneo frontend + backend, uma opção é adicionar `concurrently` como dependência de desenvolvimento e criar um script `dev` no root que execute os dois processos.
- Incluir no README instruções de como configurar variáveis de ambiente (por exemplo, credenciais do banco ou endpoints) se houver integrações reais.

## Rodando em CI

- Em CI, preferível usar `npm ci` (instala uma cópia reprodutível das deps) e então:

```yaml
# exemplo de passos:
npm ci
npm --prefix src/frontend ci
npm test
```

## Rodando o Back:
    npm run start:backend


## Rodando o Front:
    npm run start:frontend

## Rodando o Test:
    npm test



Licença: projeto para fins educacionais (Equipe 10 - SI 2025.2).

