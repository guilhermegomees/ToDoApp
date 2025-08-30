namespace TodoApp.Application.Tasks;

public sealed record TaskDto(int Id, string Title, string Description, bool IsCompleted);
public sealed record CreateTaskRequest(string Title, string? Description);
public sealed record UpdateTaskRequest(string? Title, string? Description, bool IsCompleted);
