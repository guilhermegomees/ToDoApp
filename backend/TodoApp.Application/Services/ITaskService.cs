using TodoApp.Application.Dtos;

namespace TodoApp.Application.Tasks;

public interface ITaskService
{
    Task<IEnumerable<TaskDto>> ListAsync(Domain.Entities.TaskStatus? status, CancellationToken ct = default);
    Task<TaskDto?> GetAsync(int id, CancellationToken ct = default);
    Task<TaskDto> CreateAsync(CreateTaskRequest req, CancellationToken ct = default);
    Task<TaskDto?> UpdateAsync(int id, UpdateTaskRequest req, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}