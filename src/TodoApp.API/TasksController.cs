using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.Application.Tasks;
using TodoApp.Domain.Entities;
using TodoApp.Infrastructure.Persistence;
using TodoApp.Infrastructure.Repositories;

namespace TodoApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ITaskRepository _taskRepository;

        public TasksController(ITaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }

        // GET: api/tasks
        [HttpGet]
        public async Task<IActionResult> GetTasks(bool? isCompleted, CancellationToken ct)
        {
            var list = await _taskRepository.ListAsync(isCompleted, ct);
            var dtos = list.Select(t => new TaskDto(t.Id, t.Title, t.Description, t.IsCompleted));
            return Ok(dtos);
        }

        // GET: api/tasks/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetTask(int id, CancellationToken ct)
        {
            var e = await _taskRepository.GetAsync(id, ct);
            return e is null
                ? NotFound()
                : Ok(new TaskDto(e.Id, e.Title, e.Description, e.IsCompleted));
        }

        // POST: api/tasks
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskRequest req, CancellationToken ct)
        {
            try
            {
                var entity = new TaskItem(req.Title, req.Description);
                await _taskRepository.AddAsync(entity, ct);
                await _taskRepository.SaveChangesAsync(ct);
                var dto = new TaskDto(entity.Id, entity.Title, entity.Description, entity.IsCompleted);
                return CreatedAtAction(nameof(GetTask), new { id = dto.Id }, dto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // PUT: api/tasks/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskRequest req, CancellationToken ct)
        {
            var e = await _taskRepository.GetAsync(id, ct);
            if (e is null) return NotFound();

            try
            {
                if (!string.IsNullOrWhiteSpace(req.Title)) e.SetTitle(req.Title);
                if (req.Description is not null) e.SetDescription(req.Description);
                e.ToggleCompleted(req.IsCompleted);
                await _taskRepository.SaveChangesAsync(ct);
                var dto = new TaskDto(e.Id, e.Title, e.Description, e.IsCompleted);
                return Ok(dto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // DELETE: api/tasks/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTask(int id, CancellationToken ct)
        {
            var removed = await _taskRepository.RemoveAsync(id, ct);
            if (!removed) return NotFound();
            await _taskRepository.SaveChangesAsync(ct);
            return Ok();
        }
    }
}