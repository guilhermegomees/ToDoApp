using TodoApp.Application.Dtos;
using TodoApp.Domain.Entities;
using TodoApp.Infrastructure.Repositories;

namespace TodoApp.Application.Tasks;

public sealed class TaskService(ITaskRepository repo) : ITaskService
{
    public async Task<IEnumerable<TaskDto>> ListAsync(Domain.Entities.TaskStatus? status, CancellationToken ct = default)
    {
        var items = await repo.ListAsync(status, ct);
        return items.Select(i => i.ToDto());
    }

    public async Task<TaskDto?> GetAsync(int id, CancellationToken ct = default)
    {
        var e = await repo.GetAsync(id, ct);
        return e?.ToDto();
    }

    public async Task<TaskDto> CreateAsync(CreateTaskRequest req, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(req.Title))
            throw new ArgumentException("Título é obrigatório.", nameof(req.Title));

        var entity = new TaskItem(req.Title, req.Description);
        entity.SetStatus(req.Status);

        await repo.AddAsync(entity, ct);
        await repo.SaveChangesAsync(ct);
        return entity.ToDto();
    }

    public async Task<TaskDto?> UpdateAsync(int id, UpdateTaskRequest req, CancellationToken ct = default)
    {
        var e = await repo.GetAsync(id, ct);
        if (e is null) return null;

        if (!string.IsNullOrWhiteSpace(req.Title)) e.SetTitle(req.Title);
        if (req.Description is not null) e.SetDescription(req.Description);
        if (req.Status.HasValue) e.SetStatus(req.Status.Value);

        await repo.SaveChangesAsync(ct);
        return e.ToDto();
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var removed = await repo.RemoveAsync(id, ct);
        if (!removed) return false;
        await repo.SaveChangesAsync(ct);
        return true;
    }
}