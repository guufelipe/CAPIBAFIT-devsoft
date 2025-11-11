
# 🏃‍♂️ CapibaFit

Projeto educativo que converte atividade física em uma moeda virtual chamada "Capiba". Este repositório contém uma interface frontend construída com Vite + React e código de backend (lógica e integrações) em `src/backend`.

> Nota rápida: o repositório não possui um servidor Node robusto pronto para produção — o `start` no root foi ajustado para subir o frontend de desenvolvimento (Vite). O backend contém módulos e serviços, mas não há um arquivo único `index.js` na raiz.

## Status atual

- Frontend: presente em `src/frontend` — usa Vite + React. Há scripts de desenvolvimento e build em `src/frontend/package.json`.
- Backend: código em `src/backend` (APIs, integrações, serviços), mas sem um servidor principal pronto para executar (nenhum `index.js`/`server.js` na raiz que inicialize um app Express automaticamente).
- Testes: presentes em `tests/` e usam Jest. `npm test` no root executa os testes (depende de `node_modules` estar instalado).

## Como rodar (desenvolvimento)

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
devsofot-2025-2/
├─ README.md                # este arquivo
├─ package.json             # scripts (start -> sobe frontend dev)
├─ src/
│  ├─ frontend/             # Vite + React app
│  │  ├─ package.json
│  │  └─ src/               # código React (main.jsx, components...)
│  └─ backend/              # lógica do servidor, integrações e database
│     ├─ api/
│     ├─ database/
│     ├─ integrations/
│     └─ services/
├─ docs/                    # documentação e ADRs
└─ tests/                   # testes unitários/integracao (Jest)
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

## Contato / Contribuição

Se quiser, eu posso:
- criar um servidor backend mínimo e scripts `dev`/`start` para rodar tudo junto;
- adicionar instruções de variáveis de ambiente e um exemplo `.env.example`;
- configurar um workflow de CI simples (GitHub Actions) que rode testes.

---

Licença: projeto para fins educacionais (Equipe 10 - SI 2025.2).

