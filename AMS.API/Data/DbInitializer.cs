using AMS.API.Models;
using BCrypt.Net;

namespace AMS.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Users.Any())
            {
                return; // DB has been seeded
            }

            Console.WriteLine("--> Seeding MASSIVE Data...");

            // 1. Setup Password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("password123");
            var users = new List<User>();

            // 2. Create Admin
            users.Add(new User { Name = "System Administrator", Email = "admin@test.com", Role = "Admin", PasswordHash = passwordHash });

            // 3. Create 5 Teachers
            string[] teacherNames = { "Dr. Smith", "Prof. Johnson", "Ms. Davis", "Mr. Wilson", "Dr. Brown" };
            for (int i = 0; i < teacherNames.Length; i++)
            {
                users.Add(new User { Name = teacherNames[i], Email = $"teacher{i + 1}@test.com", Role = "Teacher", PasswordHash = passwordHash });
            }

            // 4. Create 50 Students
            string[] firstNames = { "Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Hannah", "Ian", "Jack", "Kathy", "Leo", "Mona", "Nina", "Oscar" };
            string[] lastNames = { "Khan", "Ahmed", "Ali", "Butt", "Shah", "Malik", "Riaz", "Hussain", "Iqbal", "Cheema" };

            var rand = new Random();
            for (int i = 1; i <= 50; i++)
            {
                var name = $"{firstNames[rand.Next(firstNames.Length)]} {lastNames[rand.Next(lastNames.Length)]}";
                users.Add(new User { Name = name, Email = $"student{i}@test.com", Role = "Student", PasswordHash = passwordHash });
            }

            context.Users.AddRange(users);
            context.SaveChanges();

            // Retrieve created users for linking
            var teachers = context.Users.Where(u => u.Role == "Teacher").ToList();
            var students = context.Users.Where(u => u.Role == "Student").ToList();

            // 5. Create Academic Sessions
            var sessions = new List<AcademicSession>
            {
                new AcademicSession { Name = "Fall 2024", StartDate = DateTime.Now.AddMonths(-5), EndDate = DateTime.Now.AddMonths(-1), IsActive = false },
                new AcademicSession { Name = "Spring 2025", StartDate = DateTime.Now.AddMonths(-1), EndDate = DateTime.Now.AddMonths(3), IsActive = true }
            };
            context.AcademicSessions.AddRange(sessions);
            context.SaveChanges();
            var currentSession = sessions.Last(); // Spring 2025

            // 6. Create Courses
            var courses = new List<Course>
            {
                new Course { Name = "Web Engineering", Code = "CS301", CreditHours = 3 },
                new Course { Name = "Operating Systems", Code = "CS302", CreditHours = 3 },
                new Course { Name = "Database Systems", Code = "CS303", CreditHours = 3 },
                new Course { Name = "Artificial Intelligence", Code = "CS401", CreditHours = 3 },
                new Course { Name = "Computer Networks", Code = "CS402", CreditHours = 3 },
                new Course { Name = "Mobile Dev", Code = "CS405", CreditHours = 3 }
            };
            context.Courses.AddRange(courses);
            context.SaveChanges();

            // 7. Create Sections
            var sections = new List<Section>
            {
                new Section { Name = "BSCS-5A", AcademicSessionId = currentSession.Id },
                new Section { Name = "BSCS-5B", AcademicSessionId = currentSession.Id },
                new Section { Name = "BSCS-7A", AcademicSessionId = currentSession.Id },
                new Section { Name = "BSSE-5A", AcademicSessionId = currentSession.Id }
            };
            context.Sections.AddRange(sections);
            context.SaveChanges();

            // 8. Allocate Teachers & Enroll Students & Timetable
            // We will assign courses to sections and enroll subsets of students
            int studentIdx = 0;

            foreach (var section in sections)
            {
                // Assign 3 random courses to this section
                var sectionCourses = courses.OrderBy(x => rand.Next()).Take(3).ToList();

                foreach (var course in sectionCourses)
                {
                    // Assign a random teacher
                    var teacher = teachers[rand.Next(teachers.Count)];
                    context.TeacherAllocations.Add(new TeacherAllocation
                    {
                        TeacherId = teacher.Id,
                        CourseId = course.Id,
                        SectionId = section.Id
                    });

                    // Create Timetable Entry (Mon/Wed or Tue/Thu)
                    string[] days = rand.Next(2) == 0 ? new[] { "Monday", "Wednesday" } : new[] { "Tuesday", "Thursday" };
                    foreach (var day in days)
                    {
                        context.TimetableEntries.Add(new TimetableEntry
                        {
                            Day = day,
                            StartTime = new TimeSpan(9 + rand.Next(0, 4), 0, 0),
                            EndTime = new TimeSpan(10 + rand.Next(0, 4), 30, 0),
                            Room = "Lab " + rand.Next(1, 10),
                            CourseId = course.Id,
                            SectionId = section.Id
                        });
                    }
                }

                // Enroll 12 students per section
                for (int j = 0; j < 12; j++)
                {
                    if (studentIdx >= students.Count) studentIdx = 0; // wrap around
                    var student = students[studentIdx++];

                    foreach (var course in sectionCourses)
                    {
                        context.StudentEnrollments.Add(new StudentEnrollment
                        {
                            StudentId = student.Id,
                            SectionId = section.Id,
                            CourseId = course.Id
                        });

                        // ----------------------------------------------------
                        // 9. GENERATE HISTORICAL ATTENDANCE (Past 30 Days)
                        // ----------------------------------------------------
                        var startDate = DateTime.UtcNow.AddDays(-30);
                        for (var date = startDate; date <= DateTime.UtcNow; date = date.AddDays(1))
                        {
                            // Skip weekends
                            if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday) continue;

                            // 80% chance of being Present, 15% Absent, 5% Leave (simulated as Absent here)
                            var statusRoll = rand.Next(100);
                            string status = "Present";
                            if (statusRoll > 80) status = "Absent";

                            // Randomly decide if class happened this day (50% chance to simulate schedule)
                            if (rand.Next(100) > 50)
                            {
                                context.Attendances.Add(new Attendance
                                {
                                    Date = date,
                                    Status = status,
                                    StudentId = student.Id,
                                    CourseId = course.Id,
                                    SectionId = section.Id
                                });
                            }
                        }
                    }
                }
            }

            context.SaveChanges();
            Console.WriteLine("--> MASSIVE Data Seeding Completed!");
        }
    }
}