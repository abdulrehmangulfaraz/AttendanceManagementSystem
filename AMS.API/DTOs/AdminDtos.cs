using System.ComponentModel.DataAnnotations;

namespace AMS.API.DTOs
{
    public class CreateSessionDto
    {
        [Required]
        public string Name { get; set; } = string.Empty; // e.g., "Fall 2025"
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class CreateCourseDto
    {
        [Required]
        public string Name { get; set; } = string.Empty; // e.g., "Operating Systems"
        [Required]
        public string Code { get; set; } = string.Empty; // e.g., "CSC300"
        public int CreditHours { get; set; }
    }

    public class CreateSectionDto
    {
        [Required]
        public string Name { get; set; } = string.Empty; // e.g., "BSCS-5A"
        [Required]
        public int AcademicSessionId { get; set; } // Which semester is this for?
    }

    public class AssignTeacherDto
    {
        [Required]
        public int TeacherId { get; set; }
        [Required]
        public int CourseId { get; set; }
        [Required]
        public int SectionId { get; set; }
    }

    public class EnrollStudentDto
    {
        [Required]
        public int StudentId { get; set; }
        [Required]
        public int CourseId { get; set; }
        [Required]
        public int SectionId { get; set; }
    }
}