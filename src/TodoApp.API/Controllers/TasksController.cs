using Microsoft.AspNetCore.Mvc;
using TodoApp.Application.Dtos;
using TodoApp.Application.Tasks;

namespace TodoApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _service;

        public TasksController(ITaskService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetTasks([FromQuery] Domain.Entities.TaskStatus? status, CancellationToken ct)
        {
            var list = await _service.ListAsync(status, ct);
            return Ok(list);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetTask(int id, CancellationToken ct)
        {
            var dto = await _service.GetAsync(id, ct);
            return dto is null ? NotFound() : Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskRequest req, CancellationToken ct)
        {
            try
            {
                var dto = await _service.CreateAsync(req, ct);
                return CreatedAtAction(nameof(GetTask), new { id = dto.Id }, dto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskRequest req, CancellationToken ct)
        {
            try
            {
                var dto = await _service.UpdateAsync(id, req, ct);
                return dto is null ? NotFound() : Ok(dto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTask(int id, CancellationToken ct)
        {
            var ok = await _service.DeleteAsync(id, ct);
            return ok ? Ok() : NotFound();
        }
    }
}