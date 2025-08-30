using Microsoft.EntityFrameworkCore;
using TodoApp.Application.Tasks;
using TodoApp.Domain.Entities;
using TodoApp.Infrastructure.Persistence;
using TodoApp.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Adicionar DbContext
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    var cs = builder.Configuration.GetConnectionString("Default");
    if (string.IsNullOrWhiteSpace(cs) && builder.Environment.IsDevelopment())
    {
        // fallback seguro apenas em dev
        var dbPath = Path.Combine(builder.Environment.ContentRootPath, "app.db");
        cs = $"Data Source={dbPath}";
    }
    else if (string.IsNullOrWhiteSpace(cs))
    {
        throw new InvalidOperationException("ConnectionStrings:Default não configurada.");
    }

    builder.Services.AddDbContext<AppDbContext>(opt => opt.UseSqlite(cs));

    opt.UseSqlite(cs);
});

// Registrar Repositórios
builder.Services.AddScoped<ITaskRepository, TaskRepository>();

// Adicionar controllers
builder.Services.AddControllers();

// Adicionar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar CORS
builder.Services.AddCors(opt => opt.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

// Usar Swagger e CORS
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

// Habilitar o uso de controllers
app.MapControllers();

app.Run();