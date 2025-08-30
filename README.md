# ToDoApp ✅

API simples de tarefas usando **.NET 8 (Minimal API)**, **Entity Framework Core** e **SQLite**, estruturada em camadas: **API → Application → Domain → Infrastructure**.

### 📦 Tecnologias

- [.NET 8](https://dotnet.microsoft.com/) (Minimal API)
- [Entity Framework Core](https://learn.microsoft.com/ef/) (SQLite)
- Arquitetura em camadas (inspirada em Clean Architecture)
- Swagger (habilitado apenas em **Development**)

### 🚀 Como rodar localmente

### 1. Pré-requisitos

- .NET SDK 8.0 ou superior
- EF Core Tools (opcional, para migrations)
```
dotnet tool install -g dotnet-ef
```

### 2. Restaurar e compilar
```
dotnet restore
dotnet build
```

### 3. Rodar API (Development)

No projeto da API:
```
cd src/TodoApp.API
dotnet run
```
Em Development, se a connection string não for configurada, o app cria/usa automaticamente um banco SQLite local app.db.

A API sobe em:

👉 Swagger: https://localhost:5134/swagger

### 4. Criar banco/tabelas (EF Migrations)
```
cd src/TodoApp.API
dotnet ef database update
```
Isso cria o banco app.db com a tabela Tasks.


### 🔧 Configuração de Connection String

### Development

Você pode usar o fallback SQLite local ou configurar via User Secrets:
```
cd src/TodoApp.API
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Default" "Data Source=app.db"
```

### 📚 Endpoints

Base: /tasks

| Método | Rota                      | Descrição               | Status codes      |
| ------ | ------------------------- | ----------------------- | ----------------- |
| GET    | `/tasks?isCompleted=true` | Lista tarefas filtradas | 200               |
| GET    | `/tasks/{id}`             | Detalhe da tarefa       | 200, 404          |
| POST   | `/tasks`                  | Cria tarefa             | 200 (ou 201)      |
| PUT    | `/tasks/{id}`             | Atualiza tarefa         | 200, 400, 404     |
| DELETE | `/tasks/{id}`             | Remove tarefa           | 200 (ou 204), 404 |

### 🛠️ Comandos úteis

### Criar migration:
```
dotnet ef migrations add Init
```

### Atualizar banco:
```
dotnet ef database update
```

### Rodar aplicação:
```
dotnet run --project src/TodoApp.API
```
