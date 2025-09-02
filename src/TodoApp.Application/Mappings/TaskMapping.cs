using TodoApp.Application.Dtos;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.Tasks;

public static class TaskMappings
{
    public static TaskDto ToDto(this TaskItem e) => new(e.Id, e.Title, e.Description, e.Status);
}
