using TodoApp.Domain.Entities;

namespace TodoApp.Application.Dtos;

public sealed class TaskDto
{
    public TaskDto(int id, string title, string description, Domain.Entities.TaskStatus status)
    {
        Id = id;
        Title = title;
        Description = description;
        Status = status;
    }

    public int Id { get; init; }
    public string Title { get; init; } = null!;
    public string Description { get; init; } = string.Empty;
    public Domain.Entities.TaskStatus Status { get; init; }
}

public sealed class CreateTaskRequest
{
    public string Title { get; init; } = null!;
    public string? Description { get; init; }
    public Domain.Entities.TaskStatus Status { get; init; } = Domain.Entities.TaskStatus.NotStarted;
}

public sealed class UpdateTaskRequest
{
    public string? Title { get; init; }
    public string? Description { get; init; }
    public Domain.Entities.TaskStatus? Status { get; init; }
}
