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
    [Authorize(Roles = "Student")]
    public class StudentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Get My Registered Courses (Dashboard)
        [HttpGet("my-courses")]
        public async Task<IActionResult> GetMyCourses()
        {
            var studentId = GetStudentId();
            if (studentId == 0) return Unauthorized();

            var courses = await _context.StudentEnrollments
                .Include(se => se.Course)
                .Include(se => se.Section)
                .Where(se => se.StudentId == studentId)
                .Select(se => new
                {
                    CourseId = se.CourseId,
                    CourseName = se.Course.Name,
                    CourseCode = se.Course.Code,
                    SectionName = se.Section.Name,
                    // Find the teacher assigned to this specific Course + Section
                    TeacherName = _context.TeacherAllocations
                        .Where(ta => ta.CourseId == se.CourseId && ta.SectionId == se.SectionId)
                        .Select(ta => ta.Teacher.Name)
                        .FirstOrDefault() ?? "TBA"
                })
                .ToListAsync();

            return Ok(courses);
        }

        // 2. Get Student Attendance Report (Detailed & Summary)
        [HttpGet("report")]
        public async Task<IActionResult> GetStudentReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var studentId = GetStudentId();
            if (studentId == 0) return Unauthorized();

            // Default to last 30 days if null
            var start = startDate ?? DateTime.Now.AddDays(-30);
            var end = endDate ?? DateTime.Now.AddDays(1); // Add 1 day to include today effectively

            var attendanceQuery = _context.Attendances
                .Include(a => a.Course)
                .Where(a => a.StudentId == studentId && a.Date >= start && a.Date < end);

            var attendanceList = await attendanceQuery
                .OrderByDescending(a => a.Date)
                .Select(a => new
                {
                    a.Date,
                    a.Status,
                    CourseName = a.Course.Name
                })
                .ToListAsync();

            // Calculate Summary per Course
            var summary = attendanceList
                .GroupBy(a => a.CourseName)
                .Select(g => new
                {
                    CourseName = g.Key,
                    Present = g.Count(x => x.Status == "Present"),
                    Absent = g.Count(x => x.Status == "Absent"),
                    Percentage = (double)g.Count(x => x.Status == "Present") / g.Count() * 100
                })
                .ToList();

            return Ok(new { Records = attendanceList, Summary = summary });
        }

        // Helper to get ID from token
        private int GetStudentId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("id");
            return claim != null ? int.Parse(claim.Value) : 0;
        }
    }
}