# 📌 TodoApp

Aplicação **fullstack** para gerenciamento de tarefas, desenvolvida em **.NET 8 (C#)** no backend e **React + Vite** no frontend.

---

## 🚀 Tecnologias Utilizadas

### Backend
- [.NET 8](https://dotnet.microsoft.com/)  
- Entity Framework Core  
- SQLite  

### Frontend
- [React](https://reactjs.org/)  
- [Vite](https://vitejs.dev/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [MUI](https://mui.com/) (Material UI)  

---

## ⚙️ Como rodar o projeto

### 1. Clone o repositório
```bash
git clone https://github.com/guilhermegomees/ToDoApp
cd TodoApp
```

### 2. Instale o .NET 8
Baixe e instale o [.NET 8 SDK](https://dotnet.microsoft.com/download?utm_source=chatgpt.com)

Verifique a instalação:
```bash
dotnet --version
```

### 3. Atualize o Node.js
Baixe a versão LTS mais recente do [Node.js](https://nodejs.org/?utm_source=chatgpt.com)
Verifique a instalação:
```bash
node -v
npm -v
```

### 4. Configure o banco de dados (SQLite)
Acesse a API:
```bash
cd backend/TodoApp.API
```
Crie o banco rodando as migrations:
```bash
dotnet ef database update
```
O arquivo do banco SQLite (.db) será gerado automaticamente no diretório configurado (TodoApp.API).

### 5. Inicie o backend
Ainda dentro de backend/TodoApp.API:
```bash
dotnet run
```
O backend será iniciado em http://localhost:5134

### 6. Acesse a pasta do frontend
Abra outro terminal, vá até a pasta do frontend e instale as dependências:
```bash
cd frontend
npm install
```

### 7. Inicie o frontend
```bash
npm run dev
```
O frontend será iniciado em http://localhost:5173

## 📂 Estrutura do Projeto

```bash
/backend
   /TodoApp.API
   /TodoApp.Application
   /TodoApp.Domain
   /TodoApp.Infrastructure
/frontend
   /src
```

## 📄 Licença
Este projeto está sob a licença MIT.
