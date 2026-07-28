# 👟 Cyber-Kicks — Next-Gen Sneaker E-Commerce App

![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-54-000000?style=for-the-badge&logo=expo&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)

**Cyber-Kicks** é um aplicativo mobile full-stack de e-commerce de sneakers com estética futurista *Dark Neon / Cyberpunk*. O projeto combina uma experiência de usuário (UX) fluida e ultra-responsiva no mobile com um backend rápido em FastAPI conectado ao banco de dados PostgreSQL via Supabase.

---

## ✨ Funcionalidades Principais

- ⚡ **Interface Futurista & Dark Mode**: Design OLED com tons de roxo elétrico, ciano neon e animações dinâmicas.
- 📜 **Hero Section com Paralaxe**: Animação interativa baseada no scroll da página com opacidade e efeito zoom.
- 🔍 **Busca em Tempo Real**: Pesquisa dinâmica de produtos por nome ou marca com fechamento inteligente de teclado.
- 🛒 **Carrinho de Compras**: Gerenciamento global de itens, tamanhos e quantidades via React Context API.
- ❤️ **Lista de Favoritos**: Salve e gerencie seus sneakers preferidos instantaneamente.
- 🚚 **Simulador de Frete**: Cálculo simulado de frete e prazos diretamente na tela de detalhes.
- 📦 **API REST Python**: Endpoints de catálogo e envio de pedidos construídos com FastAPI.
- ⚡ **Banco de Dados Supabase**: Armazenamento e gerenciamento dos produtos e imagens em tempo real.

---

## 🛠️ Tecnologias Utilizadas

### Frontend (`Front-Apk`)
- **React Native** & **Expo** (SDK 54)
- **TypeScript** para tipagem estática
- **React Navigation v7** (Stack & Bottom Tabs)
- **Axios** para requisições HTTP
- **Expo Vector Icons** & **Linear Gradient**

### Backend (`Back-Apk`)
- **Python 3.10+**
- **FastAPI** & **Uvicorn**
- **Supabase Python Client**
- **Pydantic v2** para validação de schemas
- **python-dotenv** para gerenciamento de variáveis de ambiente

---

## 📂 Estrutura do Repositório

```
Cyber-kicks/
├── .gitignore              # Configuração global do Git (Monorepo)
├── README.md               # Documentação oficial do projeto
├── Back-Apk/               # Backend FastAPI (Python)
│   ├── main.py             # Entrada da aplicação FastAPI & Middlewares CORS
│   ├── seed.py             # Script de povoamento inicial do banco Supabase
│   ├── routers/            # Endpoints organizados por domínio
│   │   ├── produtos.py     # Rota GET /produtos
│   │   └── pedidos.py      # Rota POST /pedidos
│   └── schemas/            # Schemas Pydantic de validação
│       └── pedido.py
└── Front-Apk/              # Frontend Mobile (Expo React Native)
    ├── App.tsx             # Componente raiz com Providers de Contexto
    ├── index.ts            # Registro do componente principal do Expo
    ├── theme.ts            # Design system e paleta de cores
    ├── app.json            # Configuração do Expo
    └── src/
        ├── @types/         # Definições de tipos TypeScript
        ├── components/     # Componentes reutilizáveis (CardProduto, etc.)
        ├── contexts/       # Estado global (CartContext, FavoritesContext)
        ├── routes/         # Navegação (AppRoutes, BottomTabNavigator)
        ├── screens/        # Telas da aplicação (Home, Details, Cart, Search, Profile)
        └── services/       # Cliente Axios de integração API
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** (v18+)
- **Python** (v3.10+)
- **Expo Go** instalado no seu celular (Android/iOS) ou um emulador/simulador configurado.

---

### 1️⃣ Configuração e Execução do Backend (`Back-Apk`)

1. Navegue até a pasta do backend:
   ```bash
   cd Back-Apk
   ```

2. Crie e ative um ambiente virtual (opcional, mas recomendado):
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # Linux/macOS
   # .venv\Scripts\activate   # Windows
   ```

3. Instale as dependências:
   ```bash
   pip install fastapi uvicorn supabase python-dotenv pydantic
   ```

4. Crie um arquivo `.env` na raiz da pasta `Back-Apk` com suas credenciais do Supabase:
   ```env
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_KEY=sua-chave-anonima-supabase
   ```

5. Executar a API em modo de desenvolvimento:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
   > A API estará rodando em `http://localhost:8000` (e no IP da sua rede local). Documentação Swagger disponível em `http://localhost:8000/docs`.

6. (Opcional) Popular o banco com dados iniciais:
   ```bash
   python3 seed.py
   ```

---

### 2️⃣ Configuração e Execução do Frontend (`Front-Apk`)

1. Abra um novo terminal e navegue até a pasta do frontend:
   ```bash
   cd Front-Apk
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Ajuste a URL base da API no arquivo `src/services/api.ts` substituindo pelo IP local da sua máquina:
   ```typescript
   const API_URL = 'http://SEU_IP_LOCAL:8000';
   ```

4. Inicie o servidor do Expo:
   ```bash
   npx expo start -c
   ```

5. Abra o aplicativo **Expo Go** no celular e escaneie o QR Code exibido no terminal.

---

## 🔒 Licença

Este projeto é desenvolvido para fins educacionais e de portfólio. Sinta-se à vontade para utilizar como referência ou base para seus projetos!
