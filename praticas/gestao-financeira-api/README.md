# gestao-financeira-api

API REST do projeto Gestão Financeira, construída com **Node.js**, **Express**, **Prisma** e **MySQL**.

---

## Pré-requisitos

- [Node.js LTS](https://nodejs.org/) (v18 ou superior)
- NPM (incluído com o Node.js)
- **MySQL** rodando localmente (ex: XAMPP, Laragon, MySQL Workbench)

---

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

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Abra o `.env` e ajuste a string de conexão com seus dados do MySQL:

```env
DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/gestao_financeira"
PORT=3000
```

> Se o seu MySQL não tiver senha, deixe assim: `mysql://root:@localhost:3306/gestao_financeira`

### 4. Crie o banco e aplique as migrações

```bash
npx prisma migrate dev
```

Isso cria automaticamente o banco `gestao_financeira` no MySQL e as tabelas `Category` e `Transaction`.

### 5. Popule as categorias padrão

```bash
npm run prisma:seed
```

Insere as 5 categorias padrão:

| name | displayName | isIncome |
|---|---|---|
| income | Renda | true |
| food | Alimentação | false |
| house | Casa | false |
| education | Educação | false |
| travel | Viagens | false |

### 6. Inicie o servidor

```bash
npm run dev
```

A API estará rodando em `http://localhost:3000`.

Confirme acessando `http://localhost:3000` no navegador — deve retornar:

```json
{ "ok": true, "name": "gestao-financeira-api" }
```

---

## Rotas disponíveis

### Health-check

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Verifica se a API está no ar |

**Resposta:**
```json
{ "ok": true, "name": "gestao-financeira-api" }
```

---

### Categorias — `/categories`

| Método | Rota | Descrição | Status |
|--------|------|-----------|--------|
| GET | `/categories` | Lista todas as categorias | 200 |
| POST | `/categories` | Cria uma nova categoria | 201 |
| PUT | `/categories/:id` | Atualiza uma categoria existente | 200 |
| DELETE | `/categories/:id` | Remove uma categoria (somente customizadas) | 204 |

**Body para POST `/categories`:**
```json
{
  "name": "health",
  "displayName": "Saúde",
  "icon": "favorite",
  "background": "#FFB6B6",
  "isIncome": false
}
```

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| name | string | sim | mín. 2 caracteres, único |
| displayName | string | sim | mín. 2 caracteres |
| icon | string | sim | nome do ícone Material |
| background | string | sim | cor hex válida (#RRGGBB) |
| isIncome | boolean | não | padrão: false |

**DELETE — regras:**
- Retorna `400` se a categoria for padrão (`isDefault: true`), com mensagem:
  ```json
  { "error": "Categorias padrão não podem ser excluídas" }
  ```
- Retorna `404` se o id não existir.

---

### Transações — `/transactions`

| Método | Rota | Descrição | Status |
|--------|------|-----------|--------|
| GET | `/transactions` | Lista todas as transações com a categoria aninhada | 200 |
| POST | `/transactions` | Cria uma nova transação | 201 |
| PUT | `/transactions/:id` | Atualiza uma transação | 200 |
| DELETE | `/transactions/:id` | Remove uma transação | 204 |

**Body para POST `/transactions`:**
```json
{
  "description": "Salário de outubro",
  "value": 3500.50,
  "date": "2026-04-29",
  "categoryId": "ID_DA_CATEGORIA"
}
```

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| description | string | sim | mín. 1 caractere |
| value | number | sim | deve ser positivo |
| date | string (ISO) | sim | data válida |
| categoryId | string | sim | deve existir no banco |

**Resposta de GET `/transactions`** — a `category` vem expandida:
```json
[
  {
    "id": "...",
    "description": "Salário de outubro",
    "value": 3500.5,
    "date": "2026-04-29T00:00:00.000Z",
    "categoryId": "...",
    "createdAt": "...",
    "updatedAt": "...",
    "category": {
      "id": "...",
      "name": "income",
      "displayName": "Renda",
      "icon": "work",
      "background": "#DE9AC3",
      "isIncome": true,
      "isDefault": true,
      "createdAt": "..."
    }
  }
]
```

---

## Validação de erros (Zod)

Qualquer campo inválido retorna `400 Bad Request` no formato:

```json
{
  "error": "Dados inválidos",
  "details": [
    {
      "field": "value",
      "message": "Number must be greater than 0"
    }
  ]
}
```

**Exemplo de body inválido para teste:**
```json
{ "description": "" }
```

---

## Coleção do Postman

A coleção completa está em [`postman/collection.json`](postman/collection.json).

### Como importar

1. Abra o Postman
2. Clique em **Import** (canto superior esquerdo)
3. Selecione o arquivo `postman/collection.json`
4. A coleção **"Gestão Financeira API"** aparecerá com todas as requisições prontas

> A coleção já possui scripts automáticos que salvam os IDs de categoria e transação em variáveis, dispensando copiar e colar manualmente.

### Ordem de execução recomendada

1. Health-check
2. Listar categorias *(salva o id de `income` automaticamente)*
3. Criar categoria
4. Atualizar categoria
5. Excluir categoria (personalizada)
6. Excluir categoria padrão *(deve retornar 400)*
7. Criar transação *(usa o id de `income` salvo)*
8. Listar transações
9. Excluir transação
10. Validar erros (Zod)

---

## Scripts disponíveis

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Inicia com hot-reload (nodemon) |
| `npm start` | Inicia sem hot-reload |
| `npm run prisma:migrate` | Cria/aplica migrações do banco |
| `npm run prisma:seed` | Popula as 5 categorias padrão |
| `npm run prisma:studio` | Abre o Prisma Studio (visualizador do banco) |

---

## Estrutura do projeto

```
gestao-financeira-api/
├── postman/
│   └── collection.json        # Coleção do Postman
├── prisma/
│   ├── dev.db                 # Banco de dados SQLite (gerado)
│   ├── schema.prisma          # Modelos do banco
│   ├── seed.js                # Dados iniciais (5 categorias)
│   └── migrations/            # Histórico de migrações
├── src/
│   ├── lib/
│   │   └── prisma.js          # Instância do Prisma Client
│   ├── middlewares/
│   │   └── errorHandler.js    # Tratamento global de erros
│   ├── routes/
│   │   ├── categories.js      # CRUD de categorias
│   │   └── transactions.js    # CRUD de transações
│   ├── schemas/
│   │   ├── categorySchema.js  # Validação Zod para categorias
│   │   └── transactionSchema.js # Validação Zod para transações
│   └── server.js              # Entry point da API
├── .env.example               # Modelo de variáveis de ambiente
└── package.json
```
