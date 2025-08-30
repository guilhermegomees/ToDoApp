using Microsoft.EntityFrameworkCore;
using TodoApp.Infrastructure.Persistence;
using TodoApp.Infrastructure.Repositories;
using TodoApp.Application.Tasks;

var builder = WebApplication.CreateBuilder(args);

// DbContext
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    var cs = builder.Configuration.GetConnectionString("Default");
    if (string.IsNullOrWhiteSpace(cs) && builder.Environment.IsDevelopment())
    {
        var dbPath = Path.Combine(builder.Environment.ContentRootPath, "app.db");
        cs = $"Data Source={dbPath}";
    }
    else if (string.IsNullOrWhiteSpace(cs))
    {
        throw new InvalidOperationException("ConnectionStrings:Default não configurada.");
    }

    opt.UseSqlite(cs);
});

// DI: Repository e Service
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<ITaskService, TaskService>();

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(opt => opt.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.MapControllers();
app.Run();