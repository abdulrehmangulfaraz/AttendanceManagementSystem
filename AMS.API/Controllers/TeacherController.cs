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

        // 1. Get My Allocations
        [HttpGet("my-allocations")]
        public async Task<IActionResult> GetMyAllocations()
        {
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

        // 2. Get Students for a Class
        [HttpGet("students/{courseId}/{sectionId}")]
        public async Task<IActionResult> GetStudentsForClass(int courseId, int sectionId)
        {
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

        // 5. Get My Timetable (FIXED CAST ERROR)
        [HttpGet("my-timetable")]
        public async Task<IActionResult> GetMyTimetable()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("id");
            if (userIdClaim == null) return Unauthorized();
            int teacherId = int.Parse(userIdClaim.Value);

            // Get list of Course IDs (ints)
            var courseIds = await _context.TeacherAllocations
                .Where(ta => ta.TeacherId == teacherId)
                .Select(ta => ta.CourseId)
                .ToListAsync();

            var timetable = await _context.TimetableEntries
                .Include(t => t.Course)
                .Include(t => t.Section)
                // FIX: Ensure t.CourseId is treated as int. 
                // We use (int) casting or .Value if it's nullable.
                .Where(t => courseIds.Contains((int)t.CourseId))
                .Select(t => new
                {
                    t.Day,
                    t.StartTime,
                    t.EndTime,
                    CourseName = t.Course.Name,
                    SectionName = t.Section.Name,
                    t.Room
                })
                .OrderBy(t => t.Day).ThenBy(t => t.StartTime)
                .ToListAsync();

            return Ok(timetable);
        }

        // 6. Get Attendance Report
        [HttpGet("reports")]
        public async Task<IActionResult> GetAttendanceReport(
            [FromQuery] int courseId,
            [FromQuery] int sectionId,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            // Robust Date Logic (Includes the full EndDate)
            var nextDay = endDate.AddDays(1);

            var attendanceData = await _context.Attendances
                .Include(a => a.Student)
                .Where(a => a.CourseId == courseId &&
                            a.SectionId == sectionId &&
                            a.Date >= startDate &&
                            a.Date < nextDay)
                .OrderBy(a => a.Date)
                .ToListAsync();

            var chartData = attendanceData
                .GroupBy(a => a.Date.Date)
                .Select(g => new
                {
                    Date = g.Key.ToString("yyyy-MM-dd"),
                    Present = g.Count(x => x.Status == "Present"),
                    Absent = g.Count(x => x.Status == "Absent")
                })
                .ToList();

            var tableData = attendanceData
                .GroupBy(a => a.StudentId)
                .Select(g => new
                {
                    StudentName = g.First().Student?.Name ?? "Unknown",
                    TotalPresent = g.Count(x => x.Status == "Present"),
                    TotalAbsent = g.Count(x => x.Status == "Absent"),
                    Percentage = g.Count() == 0 ? 0 : (double)g.Count(x => x.Status == "Present") / g.Count() * 100
                })
                .OrderBy(x => x.StudentName)
                .ToList();

            return Ok(new { Chart = chartData, Table = tableData });
        }
    }
}