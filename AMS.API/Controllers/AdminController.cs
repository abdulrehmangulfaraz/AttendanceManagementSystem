using AMS.API.Data;
using AMS.API.DTOs;
using AMS.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // SECURITY: Only Admins can access this
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Create Academic Session
        [HttpPost("sessions")]
        public async Task<IActionResult> CreateSession(CreateSessionDto request)
        {
            var session = new AcademicSession
            {
                Name = request.Name,
                StartDate = request.StartDate,
                EndDate = request.EndDate
            };

            _context.AcademicSessions.Add(session);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Session created successfully", sessionId = session.Id });
        }

        // 2. Create Course
        [HttpPost("courses")]
        public async Task<IActionResult> CreateCourse(CreateCourseDto request)
        {
            var course = new Course
            {
                Name = request.Name,
                Code = request.Code,
                CreditHours = request.CreditHours
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Course created successfully", courseId = course.Id });
        }

        // 3. Create Section
        [HttpPost("sections")]
        public async Task<IActionResult> CreateSection(CreateSectionDto request)
        {
            // Validate that the Session exists first
            var session = await _context.AcademicSessions.FindAsync(request.AcademicSessionId);
            if (session == null)
            {
                return NotFound("Academic Session not found.");
            }

            var section = new Section
            {
                Name = request.Name,
                AcademicSessionId = request.AcademicSessionId
            };

            _context.Sections.Add(section);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Section created successfully", sectionId = section.Id });
        }
    }
}