using AMS.API.Data;
using AMS.API.DTOs;
using AMS.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Teacher")] // SECURITY: Only Teachers
    public class TeacherController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TeacherController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Mark Attendance
        [HttpPost("mark-attendance")]
        public async Task<IActionResult> MarkAttendance(MarkAttendanceDto request)
        {
            // Optional: Check if this Teacher is actually assigned to this Course/Section
            // For now, we allow any teacher to mark for simplicity, or we can add that check later.

            // Check if attendance already exists for this day to prevent duplicates
            var existingRecord = await _context.Attendances
                .FirstOrDefaultAsync(a => a.StudentId == request.StudentId &&
                                          a.CourseId == request.CourseId &&
                                          a.Date.Date == request.Date.Date);

            if (existingRecord != null)
            {
                // Update existing record
                existingRecord.Status = request.IsPresent ? "Present" : "Absent";
            }
            else
            {
                // Create new record
                var attendance = new Attendance
                {
                    StudentId = request.StudentId,
                    CourseId = request.CourseId,
                    SectionId = request.SectionId,
                    Date = request.Date,
                    Status = request.IsPresent ? "Present" : "Absent"
                };
                _context.Attendances.Add(attendance);
            }

            await _context.SaveChangesAsync();
            return Ok("Attendance marked successfully.");
        }
    }
}