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
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- 1. MANAGE USERS ---
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users.Select(u => new { u.Id, u.Name, u.Email, u.Role }).ToListAsync();
            return Ok(users);
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound("User not found");
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok("User deleted");
        }

        // --- 2. MANAGE SESSIONS ---
        [HttpGet("sessions")]
        public async Task<IActionResult> GetAllSessions()
        {
            return Ok(await _context.AcademicSessions.ToListAsync());
        }

        [HttpPost("sessions")]
        public async Task<IActionResult> CreateSession(CreateSessionDto request)
        {
            var session = new AcademicSession { Name = request.Name, StartDate = request.StartDate, EndDate = request.EndDate };
            _context.AcademicSessions.Add(session);
            await _context.SaveChangesAsync();
            return Ok(session);
        }

        [HttpDelete("sessions/{id}")]
        public async Task<IActionResult> DeleteSession(int id)
        {
            var s = await _context.AcademicSessions.FindAsync(id);
            if (s == null) return NotFound();
            _context.AcademicSessions.Remove(s);
            await _context.SaveChangesAsync();
            return Ok("Session deleted");
        }

        // --- 3. MANAGE COURSES ---
        [HttpGet("courses")]
        public async Task<IActionResult> GetAllCourses()
        {
            return Ok(await _context.Courses.ToListAsync());
        }

        [HttpPost("courses")]
        public async Task<IActionResult> CreateCourse(CreateCourseDto request)
        {
            var c = new Course { Name = request.Name, Code = request.Code, CreditHours = request.CreditHours };
            _context.Courses.Add(c);
            await _context.SaveChangesAsync();
            return Ok(c);
        }

        [HttpDelete("courses/{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var c = await _context.Courses.FindAsync(id);
            if (c == null) return NotFound();
            _context.Courses.Remove(c);
            await _context.SaveChangesAsync();
            return Ok("Course deleted");
        }

        // --- 4. MANAGE SECTIONS ---
        [HttpGet("sections")]
        public async Task<IActionResult> GetAllSections()
        {
            // Include Session Name for readability
            var sections = await _context.Sections.Include(s => s.AcademicSession).Select(s => new
            {
                s.Id,
                s.Name,
                SessionName = s.AcademicSession.Name
            }).ToListAsync();
            return Ok(sections);
        }

        [HttpPost("sections")]
        public async Task<IActionResult> CreateSection(CreateSectionDto request)
        {
            var s = new Section { Name = request.Name, AcademicSessionId = request.AcademicSessionId };
            _context.Sections.Add(s);
            await _context.SaveChangesAsync();
            return Ok(s);
        }

        [HttpDelete("sections/{id}")]
        public async Task<IActionResult> DeleteSection(int id)
        {
            var s = await _context.Sections.FindAsync(id);
            if (s == null) return NotFound();
            _context.Sections.Remove(s);
            await _context.SaveChangesAsync();
            return Ok("Section deleted");
        }

        // --- 5. ASSIGNMENTS (ALLOCATIONS) ---
        [HttpPost("assign-teacher")]
        public async Task<IActionResult> AssignTeacher(AssignTeacherDto request)
        {
            var allocation = new TeacherAllocation { TeacherId = request.TeacherId, CourseId = request.CourseId, SectionId = request.SectionId };
            _context.TeacherAllocations.Add(allocation);
            await _context.SaveChangesAsync();
            return Ok("Teacher assigned");
        }

        [HttpPost("enroll-student")]
        public async Task<IActionResult> EnrollStudent(EnrollStudentDto request)
        {
            var enrollment = new StudentEnrollment { StudentId = request.StudentId, CourseId = request.CourseId, SectionId = request.SectionId };
            _context.StudentEnrollments.Add(enrollment);
            await _context.SaveChangesAsync();
            return Ok("Student enrolled");
        }

        // View all assignments (New)
        [HttpGet("assignments")]
        public async Task<IActionResult> GetAssignments()
        {
            var teachers = await _context.TeacherAllocations
                .Select(t => new { Type = "Teacher", Name = t.Teacher.Name, Course = t.Course.Name, Section = t.Section.Name, Id = t.Id })
                .ToListAsync();

            var students = await _context.StudentEnrollments
                .Select(s => new { Type = "Student", Name = s.Student.Name, Course = s.Course.Name, Section = s.Section.Name, Id = s.Id })
                .ToListAsync();

            return Ok(new { teachers, students });
        }

        // --- TIMETABLE MANAGEMENT ---
        [HttpGet("timetable/{sectionId}")]
        public async Task<IActionResult> GetTimetable(int sectionId)
        {
            var entries = await _context.TimetableEntries
                .Where(t => t.SectionId == sectionId)
                .Include(t => t.Course)
                .OrderBy(t => t.Day).ThenBy(t => t.StartTime)
                .Select(t => new
                {
                    t.Id,
                    t.Day,
                    t.StartTime,
                    t.EndTime,
                    t.Room,
                    CourseName = t.Course.Name
                })
                .ToListAsync();
            return Ok(entries);
        }

        [HttpPost("timetable")]
        public async Task<IActionResult> AddTimetableEntry(TimetableEntry entry)
        {
            // Basic conflict check
            bool conflict = await _context.TimetableEntries.AnyAsync(t =>
                t.SectionId == entry.SectionId && t.Day == entry.Day &&
                ((entry.StartTime >= t.StartTime && entry.StartTime < t.EndTime) ||
                 (entry.EndTime > t.StartTime && entry.EndTime <= t.EndTime)));

            if (conflict) return BadRequest("Time slot conflict detected for this section.");

            _context.TimetableEntries.Add(entry);
            await _context.SaveChangesAsync();
            return Ok(entry);
        }

        [HttpDelete("timetable/{id}")]
        public async Task<IActionResult> DeleteTimetableEntry(int id)
        {
            var entry = await _context.TimetableEntries.FindAsync(id);
            if (entry == null) return NotFound();
            _context.TimetableEntries.Remove(entry);
            await _context.SaveChangesAsync();
            return Ok("Deleted");
        }
    }
}