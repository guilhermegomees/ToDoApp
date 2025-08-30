namespace TodoApp.Domain.Entities;

public sealed class TaskItem
{
    private TaskItem()
    {
        
    }

    public int Id { get; private set; }
    public string Title { get; private set; } = null!;
    public string Description { get; private set; } = string.Empty;
    public bool IsCompleted { get; private set; }

    public TaskItem(string title, string? description)
    {
        SetTitle(title);
        SetDescription(description);
    }

    public void SetTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Título é obrigatório", nameof(title));
        Title = title.Trim();
    }

    public void SetDescription(string? description) =>
        Description = (description ?? string.Empty).Trim();

    public void ToggleCompleted(bool completed) => IsCompleted = completed;
}