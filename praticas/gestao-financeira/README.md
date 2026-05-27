# gestao-financeira (Frontend)

App mobile de gestão financeira pessoal, desenvolvido com **React Native**, **Expo** e **Expo Router**.

> **Atenção:** o backend (`gestao-financeira-api`) precisa estar rodando antes de iniciar o app. Siga o [README do backend](../gestao-financeira-api/README.md) primeiro.

---

## Funcionalidades implementadas

- **Tela de login** com validação de acesso (qualquer usuário + senha `1234`)
- **Mensagem de boas-vindas** com o nome do usuário autenticado no header
- **Filtro de mês/ano** nas telas de transações e resumo
- **Gráfico de pizza (donut)** na aba de resumo, com legenda por categoria
- **Edição e exclusão de transações** via toque longo → modal de edição
- **Categorias customizadas** além das cinco padrão (com ícone e cor)
- **Integração completa com a API** — todos os dados são salvos no banco de dados

---

## Pré-requisitos

- [Node.js LTS](https://nodejs.org/) (v18 ou superior)
- NPM (incluído com o Node.js)
- Para testar no **emulador Android**: Android Studio instalado e configurado
- Para testar no **celular físico**: app [Expo Go](https://expo.dev/go) instalado

---

## Passo a passo para rodar

### 1. Acesse a pasta do frontend

```bash
cd praticas/gestao-financeira
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

Edite o `.env` conforme o dispositivo que vai usar:

```env
# Emulador Android (padrão — funciona sem alteração)
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000

# Celular físico (Android ou iOS) — substitua pelo IP da sua máquina
# Para descobrir o IP no Windows: abra o terminal e execute "ipconfig"
# Use o valor de "Endereço IPv4" da sua rede Wi-Fi
EXPO_PUBLIC_API_URL=http://192.168.X.X:3000
```

> O endereço `10.0.2.2` é o alias padrão do emulador Android para acessar o `localhost` da máquina host. Em celular físico ou iOS, use o IP real da máquina.

### 4. Inicie o app

```bash
npx expo start --android
```

Escolha como abrir:

| Opção | Como usar |
|-------|-----------|
| Emulador Android | Pressione `a` no terminal (requer Android Studio) |
| Celular físico | Abra o **Expo Go** e escaneie o QR Code exibido |
| iOS Simulator | Pressione `i` no terminal (requer macOS + Xcode) |

---

## Como usar o app

### Login

- **Usuário:** qualquer nome (não pode ser vazio)
- **Senha:** `1234`

Após o login, o nome do usuário aparece no header de todas as telas.

### Abas disponíveis

| Aba | Descrição |
|-----|-----------|
| Transações | Lista as transações do mês/ano selecionado. Toque longo para editar ou excluir. |
| Categorias | Lista todas as categorias. Crie novas com ícone e cor personalizados. |
| + (Adicionar) | Formulário para registrar uma nova receita ou despesa. |
| Resumo | Saldo, totais de receita/despesa e gráfico de pizza por categoria. |

### Editar ou excluir uma transação

1. Na aba **Transações**, mantenha o dedo pressionado sobre uma transação por ~400ms
2. Um modal abrirá com os campos editáveis
3. Altere os campos desejados e toque em **Salvar**, ou toque em **Excluir** para remover

### Criar uma categoria customizada

1. Acesse a aba **Categorias**
2. Preencha o nome, rótulo, ícone (nome do Material Icons) e cor
3. Ative o toggle se for uma categoria de renda
4. Toque em **Criar categoria**

---

## Estrutura do projeto

```
gestao-financeira/
├── app/
│   ├── _layout.jsx            # Layout raiz com guard de autenticação
│   ├── login.jsx              # Tela de login
│   └── (tabs)/
│       ├── _layout.jsx        # Navegação por abas + header com boas-vindas
│       ├── index.jsx          # Aba: Transações (lista + filtro + toque longo)
│       ├── add-transactions.jsx # Aba: Adicionar transação
│       ├── categories.jsx     # Aba: Categorias
│       └── summary.jsx        # Aba: Resumo + gráfico de pizza
├── components/
│   ├── Button.jsx
│   ├── CategoryItem.jsx
│   ├── CategoryPicker.jsx
│   ├── CurrencyInput.jsx
│   ├── DatePicker.jsx
│   ├── DescriptionInput.jsx
│   ├── EditTransactionModal.jsx
│   ├── MonthYearFilter.jsx
│   ├── PieChartView.jsx
│   ├── SummaryItem.jsx
│   └── TransactionItem.jsx
├── constants/
│   └── colors.js              # Paleta de cores do app
├── contexts/
│   ├── AuthContext.jsx        # Estado de autenticação (login/logout)
│   └── GlobalState.jsx        # Estado global (transações e categorias)
├── services/
│   └── api.js                 # Cliente HTTP para a API
├── .env.example               # Modelo de variáveis de ambiente
└── package.json
```

---

## Scripts disponíveis

| Comando | O que faz |
|---------|-----------|
| `npx expo start` | Inicia o servidor de desenvolvimento |
| `npx expo start --android` | Abre direto no emulador Android |
| `npx expo start --ios` | Abre direto no simulador iOS |
| `npx expo start --web` | Abre no navegador |

---

## Tecnologias utilizadas

| Tecnologia | Uso |
|------------|-----|
| React Native | Framework mobile |
| Expo SDK 54 | Ferramentas e APIs nativas |
| Expo Router 6 | Navegação baseada em arquivos |
| React Navigation | Tabs e Stack navigator |
| Fetch API | Requisições HTTP para a API |
