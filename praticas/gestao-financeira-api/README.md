# gestao-financeira-api

API REST do projeto Gestão Financeira, construída com Node.js, Express e Prisma (MySQL).

## Pré-requisitos

- [Node.js LTS](https://nodejs.org/pt-br/)
- MySQL rodando localmente (ex: XAMPP, MySQL Workbench, Laragon)

## Passo a passo para rodar

### 1. Acesse a pasta do backend

```bash
cd praticas/gestao-financeira-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e edite com seus dados do MySQL:

```bash
cp .env.example .env
```

Abra o `.env` e ajuste a string de conexão:

```env
DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/gestao_financeira"
PORT=3000
```

> Se o seu MySQL não tiver senha, deixe assim: `mysql://root:@localhost:3306/gestao_financeira`

### 4. Crie as tabelas no banco

```bash
npx prisma migrate dev
```

> Isso cria o banco `gestao_financeira` e todas as tabelas automaticamente.

### 5. Popule as categorias padrão

```bash
npm run prisma:seed
```

### 6. Inicie o servidor

```bash
npm run dev
```

A API estará rodando em `http://localhost:3000`.

Para confirmar, acesse `http://localhost:3000` no navegador — deve retornar:

```json
{ "ok": true, "name": "gestao-financeira-api" }
```

## Rotas disponíveis

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/categories` | Lista todas as categorias |
| POST | `/categories` | Cria uma categoria |
| GET | `/transactions` | Lista todas as transações |
| POST | `/transactions` | Cria uma transação |
| PUT | `/transactions/:id` | Atualiza uma transação |
| DELETE | `/transactions/:id` | Remove uma transação |

## Scripts disponíveis

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Inicia com hot-reload (nodemon) |
| `npm start` | Inicia sem hot-reload |
| `npm run prisma:migrate` | Aplica migrações do banco |
| `npm run prisma:seed` | Popula categorias padrão |
| `npm run prisma:studio` | Abre o Prisma Studio (visualizador do banco) |
