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

        // 4. Assign Teacher to Course & Section
        [HttpPost("assign-teacher")]
        public async Task<IActionResult> AssignTeacher(AssignTeacherDto request)
        {
            // 1. Verify Teacher exists and is actually a Teacher
            var teacher = await _context.Users.FindAsync(request.TeacherId);
            if (teacher == null || teacher.Role != "Teacher")
            {
                return BadRequest("Invalid Teacher ID or User is not a Teacher.");
            }

            // 2. Verify Course exists
            var course = await _context.Courses.FindAsync(request.CourseId);
            if (course == null) return NotFound("Course not found.");

            // 3. Verify Section exists
            var section = await _context.Sections.FindAsync(request.SectionId);
            if (section == null) return NotFound("Section not found.");

            // 4. Create Allocation
            var allocation = new TeacherAllocation
            {
                TeacherId = request.TeacherId,
                CourseId = request.CourseId,
                SectionId = request.SectionId
            };

            _context.TeacherAllocations.Add(allocation);
            await _context.SaveChangesAsync();

            return Ok("Teacher assigned successfully.");
        }

        // 5. Enroll Student in Course & Section
        [HttpPost("enroll-student")]
        public async Task<IActionResult> EnrollStudent(EnrollStudentDto request)
        {
            // 1. Verify Student exists and role is correct
            var student = await _context.Users.FindAsync(request.StudentId);
            if (student == null || student.Role != "Student")
            {
                return BadRequest("Invalid Student ID or User is not a Student.");
            }

            // 2. Verify Course and Section exist
            var course = await _context.Courses.FindAsync(request.CourseId);
            var section = await _context.Sections.FindAsync(request.SectionId);

            if (course == null || section == null)
                return NotFound("Course or Section not found.");

            // 3. Create Enrollment
            var enrollment = new StudentEnrollment
            {
                StudentId = request.StudentId,
                CourseId = request.CourseId,
                SectionId = request.SectionId
            };

            _context.StudentEnrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            return Ok("Student enrolled successfully.");
        }
    }
}