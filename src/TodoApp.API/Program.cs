using Microsoft.EntityFrameworkCore;
using TodoApp.Application.Tasks;
using TodoApp.Domain.Entities;
using TodoApp.Infrastructure.Persistence;
using TodoApp.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

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
builder.Services.AddScoped<ITaskRepository, TaskRepository>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(opt => opt.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

builder.Services.AddRateLimiter(o => o.AddFixedWindowLimiter("default", opt =>
{
    opt.Window = TimeSpan.FromSeconds(10);
    opt.PermitLimit = 100;
    opt.QueueLimit = 0;
}));
app.UseRateLimiter();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

var group = app.MapGroup("/tasks");

// GET /tasks
group.MapGet("/", async (bool? isCompleted, ITaskRepository repo, CancellationToken ct) =>
{
    var list = await repo.ListAsync(isCompleted, ct);
    var dtos = list.Select(t => new TaskDto(t.Id, t.Title, t.Description, t.IsCompleted));
    return Results.Ok(dtos);
});

// GET /tasks/{id}
group.MapGet("/{id:int}", async (int id, ITaskRepository repo, CancellationToken ct) =>
{
    var e = await repo.GetAsync(id, ct);
    return e is null
        ? Results.NotFound()
        : Results.Ok(new TaskDto(e.Id, e.Title, e.Description, e.IsCompleted));
});

// POST /tasks
group.MapPost("/", async (CreateTaskRequest req, ITaskRepository repo, CancellationToken ct) =>
{
    try
    {
        var entity = new TaskItem(req.Title, req.Description);
        await repo.AddAsync(entity, ct);
        await repo.SaveChangesAsync(ct);
        var dto = new TaskDto(entity.Id, entity.Title, entity.Description, entity.IsCompleted);
        return Results.Created($"/tasks/{dto.Id}", dto);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

// PUT /tasks/{id}
group.MapPut("/{id:int}", async (int id, UpdateTaskRequest req, ITaskRepository repo, CancellationToken ct) =>
{
    var e = await repo.GetAsync(id, ct);
    if (e is null) return Results.NotFound();

    try
    {
        if (!string.IsNullOrWhiteSpace(req.Title)) e.SetTitle(req.Title);
        if (req.Description is not null) e.SetDescription(req.Description);
        e.ToggleCompleted(req.IsCompleted);
        await repo.SaveChangesAsync(ct);
        var dto = new TaskDto(e.Id, e.Title, e.Description, e.IsCompleted);
        return Results.Ok(dto);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

// DELETE /tasks/{id}
group.MapDelete("/{id:int}", async (int id, ITaskRepository repo, CancellationToken ct) =>
{
    var removed = await repo.RemoveAsync(id, ct);
    if (!removed) return Results.NotFound();
    await repo.SaveChangesAsync(ct);
    return Results.Ok();
});

app.Run();