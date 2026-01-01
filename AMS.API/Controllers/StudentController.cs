using AMS.API.Data;
using AMS.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Student")] // SECURITY: Only Students
    public class StudentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. View My Attendance
        [HttpGet("my-attendance")]
        public async Task<IActionResult> GetMyAttendance()
        {
            // Get the ID of the currently logged-in student from the Token
            var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (studentIdClaim == null) return Unauthorized();

            int studentId = int.Parse(studentIdClaim.Value);

            var myAttendance = await _context.Attendances
                .Include(a => a.Course) // Load Course Name
                .Where(a => a.StudentId == studentId)
                .OrderByDescending(a => a.Date)
                .Select(a => new StudentAttendanceDto
                {
                    CourseName = a.Course.Name,
                    Date = a.Date,
                    Status = a.Status
                })
                .ToListAsync();

            return Ok(myAttendance);
        }
    }
}