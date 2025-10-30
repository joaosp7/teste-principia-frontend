#  Teste Principia - Frontend

Aplicação React + TypeScript para gerenciamento de items com CRUD completo, desenvolvida como teste técnico.

### 1. Instale as dependências
```bash
npm install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_API_SECRET=secret
```

> **Nota**: Um arquivo `.env.example` está incluído como referência.

### 3. Execute a aplicação

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

##  Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes com UI
```bash
npm run test:ui
```

### Cobertura de testes
```bash
npm run test:coverage
```

