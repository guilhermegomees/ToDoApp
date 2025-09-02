using TodoApp.Domain.Entities;

namespace TodoApp.Infrastructure.Repositories;

public interface ITaskRepository
{
    Task<IEnumerable<TaskItem>> ListAsync(Domain.Entities.TaskStatus? status, CancellationToken ct = default);
    Task<TaskItem?> GetAsync(int id, CancellationToken ct = default);
    Task AddAsync(TaskItem entity, CancellationToken ct = default);
    Task<bool> RemoveAsync(int id, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}