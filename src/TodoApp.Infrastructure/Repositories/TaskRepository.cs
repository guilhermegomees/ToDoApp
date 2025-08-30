using Microsoft.EntityFrameworkCore;
using TodoApp.Domain.Entities;
using TodoApp.Infrastructure.Persistence;

namespace TodoApp.Infrastructure.Repositories;

public sealed class TaskRepository(AppDbContext db) : ITaskRepository
{
    public async Task<List<TaskItem>> ListAsync(bool? isCompleted, CancellationToken ct = default)
    {
        var query = db.Tasks.AsNoTracking();
        if (isCompleted is not null) query = query.Where(t => t.IsCompleted == isCompleted);
        return await query.OrderBy(t => t.IsCompleted).ThenBy(t => t.Title).ToListAsync(ct);
    }

    public Task<TaskItem?> GetAsync(int id, CancellationToken ct = default) =>
        db.Tasks.FirstOrDefaultAsync(t => t.Id == id, ct);

    public Task AddAsync(TaskItem entity, CancellationToken ct = default) =>
        db.Tasks.AddAsync(entity, ct).AsTask();

    public async Task<bool> RemoveAsync(int id, CancellationToken ct = default)
    {
        var e = await db.Tasks.FirstOrDefaultAsync(t => t.Id == id, ct);
        if (e is null) return false;
        db.Tasks.Remove(e);
        return true;
    }

    public Task SaveChangesAsync(CancellationToken ct = default) => db.SaveChangesAsync(ct);
}