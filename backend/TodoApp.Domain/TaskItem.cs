namespace TodoApp.Domain.Entities;

public sealed class TaskItem
{
    private TaskItem() { }

    public int Id { get; private set; }
    public string Title { get; private set; } = null!;
    public string Description { get; private set; } = string.Empty;
    public TaskStatus Status { get; private set; } = TaskStatus.NotStarted;

    public TaskItem(string title, string? description)
    {
        SetTitle(title);
        SetDescription(description);
        Status = TaskStatus.NotStarted;
    }

    public void SetTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Título é obrigatório", nameof(title));
        Title = title.Trim();
    }

    public void SetDescription(string? description) =>
        Description = (description ?? string.Empty).Trim();

    public void SetStatus(TaskStatus status) => Status = status;
}