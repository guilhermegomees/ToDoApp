using TodoApp.Domain.Entities;

namespace TodoApp.Infrastructure.Repositories;

public interface ITaskRepository
{
    Task<List<TaskItem>> ListAsync(bool? isCompleted, CancellationToken ct = default);
    Task<TaskItem?> GetAsync(int id, CancellationToken ct = default);
    Task AddAsync(TaskItem entity, CancellationToken ct = default);
    Task<bool> RemoveAsync(int id, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}