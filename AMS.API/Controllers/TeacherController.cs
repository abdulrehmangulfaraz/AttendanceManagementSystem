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
    [Authorize(Roles = "Teacher")]
    public class TeacherController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TeacherController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Get My Allocations (Dashboard Data)
        [HttpGet("my-allocations")]
        public async Task<IActionResult> GetMyAllocations()
        {
            // Extract Teacher ID from Token Claims
            // Ensure your AuthController adds ClaimTypes.NameIdentifier with the User ID
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("id");
            if (userIdClaim == null) return Unauthorized("User ID not found in token.");

            int teacherId = int.Parse(userIdClaim.Value);

            var allocations = await _context.TeacherAllocations
                .Include(ta => ta.Course)
                .Include(ta => ta.Section)
                .Where(ta => ta.TeacherId == teacherId)
                .Select(ta => new
                {
                    ta.Id,
                    ta.CourseId,
                    CourseName = ta.Course.Name,
                    CourseCode = ta.Course.Code,
                    ta.SectionId,
                    SectionName = ta.Section.Name
                })
                .ToListAsync();

            return Ok(allocations);
        }

        // 2. Get Students for a Class (To Mark Attendance)
        [HttpGet("students/{courseId}/{sectionId}")]
        public async Task<IActionResult> GetStudentsForClass(int courseId, int sectionId)
        {
            // We assume you have a StudentEnrollments table based on your migrations
            // If strictly using User role without enrollment table, this query might need adjustment.
            var students = await _context.StudentEnrollments
                .Where(se => se.CourseId == courseId && se.SectionId == sectionId)
                .Include(se => se.Student)
                .Select(se => new
                {
                    se.StudentId,
                    StudentName = se.Student.Name,
                    StudentEmail = se.Student.Email
                })
                .ToListAsync();

            return Ok(students);
        }

        // 3. Mark Attendance
        [HttpPost("mark-attendance")]
        public async Task<IActionResult> MarkAttendance(MarkAttendanceDto request)
        {
            // Prevent duplicates
            var existingRecord = await _context.Attendances
                .FirstOrDefaultAsync(a => a.StudentId == request.StudentId &&
                                          a.CourseId == request.CourseId &&
                                          a.Date.Date == request.Date.Date);

            if (existingRecord != null)
            {
                existingRecord.Status = request.IsPresent ? "Present" : "Absent";
            }
            else
            {
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
            return Ok(new { message = "Attendance marked successfully." });
        }

        // 4. View Attendance History
        [HttpGet("attendance/{courseId}/{sectionId}")]
        public async Task<IActionResult> GetClassAttendance(int courseId, int sectionId)
        {
            var attendanceList = await _context.Attendances
                .Include(a => a.Student)
                .Where(a => a.CourseId == courseId && a.SectionId == sectionId)
                .OrderByDescending(a => a.Date)
                .Select(a => new AttendanceRecordDto
                {
                    StudentName = a.Student.Name,
                    Date = a.Date,
                    Status = a.Status
                })
                .ToListAsync();

            return Ok(attendanceList);
        }
    }
}