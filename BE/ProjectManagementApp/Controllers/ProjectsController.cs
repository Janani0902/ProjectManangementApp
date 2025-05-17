using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using ProjectManagementApp.Data;
using ProjectManagementApp.Hubs;
using ProjectManagementApp.Models;

namespace ProjectManagementApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<ProjectHub> _hubContext;

        public ProjectsController(AppDbContext context, IHubContext<ProjectHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            return Ok(await _context.Projects.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject(Project project)
        {
            //project.UpdatedAt = DateTime.Now;
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ProjectCreated", project);
            return Ok(project);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, Project updated)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound();

            project.Name = updated.Name;
            project.Description = updated.Description;
            //project.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            await _hubContext.Clients.All.SendAsync("ProjectUpdated", project);
            return Ok(project);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound();

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ProjectDeleted", project);
            return Ok();
        }
    }

}
