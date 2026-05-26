# gestao-financeira (Frontend)

App mobile do projeto Gestão Financeira, construído com React Native e Expo.

> **Atenção:** o backend (`gestao-financeira-api`) precisa estar rodando antes de iniciar o app. Siga o [README do backend](../gestao-financeira-api/README.md) primeiro.

## Pré-requisitos

- [Node.js LTS](https://nodejs.org/pt-br/)
- App **Expo Go** instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Celular e computador na **mesma rede Wi-Fi**

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

Abra o `.env` e ajuste a URL da API conforme o dispositivo que vai usar:

```env
# Emulador Android (padrão)
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000

# Celular físico Android ou iOS — substitua pelo IP da sua máquina
# Para descobrir seu IP: execute "ipconfig" no terminal (Windows) ou "ifconfig" (Mac/Linux)
EXPO_PUBLIC_API_URL=http://192.168.X.X:3000
```

> Para descobrir o IP da sua máquina no Windows, abra o terminal e execute:
> ```bash
> ipconfig
> ```
> Use o valor de **Endereço IPv4** da sua rede Wi-Fi.

### 4. Inicie o app

```bash
npx expo start
```

Um QR Code será exibido no terminal. Abra o app **Expo Go** no celular e escaneie o QR Code.

## Scripts disponíveis

| Comando | O que faz |
|---------|-----------|
| `npx expo start` | Inicia o servidor de desenvolvimento |
| `npx expo start --android` | Abre direto no emulador Android |
| `npx expo start --ios` | Abre direto no simulador iOS |
| `npx expo start --web` | Abre no navegador |
