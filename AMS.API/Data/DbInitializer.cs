using AMS.API.Models;
using BCrypt.Net;

namespace AMS.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            // 1. Ensure the database structure is created
            context.Database.EnsureCreated();

            // 2. Check if users already exist. If yes, we don't seed again.
            if (context.Users.Any())
            {
                return; // DB has been seeded
            }

            Console.WriteLine("--> Seeding Data...");

            // --------------------------------------------------------
            // 3. Create Users (Password for all is 'password123')
            // --------------------------------------------------------
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("password123");

            var admin = new User
            {
                Name = "Admin User",
                Email = "admin@test.com",
                Role = "Admin",
                PasswordHash = passwordHash,
                IsActive = true
            };

            var teacher = new User
            {
                Name = "Teacher User",
                Email = "teacher@test.com",
                Role = "Teacher",
                PasswordHash = passwordHash,
                IsActive = true
            };

            var student = new User
            {
                Name = "Student User",
                Email = "student@test.com",
                Role = "Student",
                PasswordHash = passwordHash,
                IsActive = true
            };

            context.Users.AddRange(admin, teacher, student);
            context.SaveChanges(); // Save to get IDs generated

            // --------------------------------------------------------
            // 4. Create Academic Data
            // --------------------------------------------------------
            var session = new AcademicSession
            {
                Name = "Fall 2025",
                StartDate = DateTime.UtcNow.AddMonths(-1),
                EndDate = DateTime.UtcNow.AddMonths(3),
                IsActive = true
            };
            context.AcademicSessions.Add(session);
            context.SaveChanges();

            var courseWeb = new Course { Name = "Web Engineering", Code = "CS301", CreditHours = 3 };
            var courseOS = new Course { Name = "Operating Systems", Code = "CS302", CreditHours = 3 };
            context.Courses.AddRange(courseWeb, courseOS);
            context.SaveChanges();

            var sectionA = new Section { Name = "BSCS-5A", AcademicSessionId = session.Id };
            var sectionB = new Section { Name = "BSCS-5B", AcademicSessionId = session.Id };
            context.Sections.AddRange(sectionA, sectionB);
            context.SaveChanges();

            // --------------------------------------------------------
            // 5. Assign Teacher to Class (Allocations)
            // --------------------------------------------------------
            // Teacher teaches Web Engineering to BSCS-5A
            var allocation = new TeacherAllocation
            {
                TeacherId = teacher.Id,
                CourseId = courseWeb.Id,
                SectionId = sectionA.Id
            };
            context.TeacherAllocations.Add(allocation);
            context.SaveChanges();

            // --------------------------------------------------------
            // 6. Enroll Student in Class
            // --------------------------------------------------------
            // Student takes Web Engineering in BSCS-5A
            var enrollment = new StudentEnrollment
            {
                StudentId = student.Id,
                CourseId = courseWeb.Id,
                SectionId = sectionA.Id,
                EnrolledAt = DateTime.UtcNow
            };
            context.StudentEnrollments.Add(enrollment);
            context.SaveChanges();

            // --------------------------------------------------------
            // 7. Create Timetable
            // --------------------------------------------------------
            var timetable = new TimetableEntry
            {
                Day = "Monday",
                StartTime = new TimeSpan(9, 0, 0), // 9:00 AM
                EndTime = new TimeSpan(10, 30, 0), // 10:30 AM
                Room = "Lab 3",
                CourseId = courseWeb.Id,
                SectionId = sectionA.Id
            };
            context.TimetableEntries.Add(timetable);
            context.SaveChanges();

            // --------------------------------------------------------
            // 8. Add Mock Attendance Records
            // --------------------------------------------------------
            var attendance1 = new Attendance
            {
                Date = DateTime.UtcNow.Date.AddDays(-1),
                Status = "Present",
                StudentId = student.Id,
                CourseId = courseWeb.Id,
                SectionId = sectionA.Id
            };
            var attendance2 = new Attendance
            {
                Date = DateTime.UtcNow.Date.AddDays(-3),
                Status = "Absent",
                StudentId = student.Id,
                CourseId = courseWeb.Id,
                SectionId = sectionA.Id
            };
            context.Attendances.AddRange(attendance1, attendance2);
            context.SaveChanges();

            Console.WriteLine("--> Data Seeding Completed!");
        }
    }
}