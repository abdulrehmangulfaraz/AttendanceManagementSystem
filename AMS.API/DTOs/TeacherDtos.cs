using System.ComponentModel.DataAnnotations;

namespace AMS.API.DTOs
{
    public class MarkAttendanceDto
    {
        [Required]
        public int StudentId { get; set; }
        [Required]
        public int CourseId { get; set; }
        [Required]
        public int SectionId { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public bool IsPresent { get; set; } // true = Present, false = Absent
    }

    public class AttendanceRecordDto
    {
        public string StudentName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    // For Students to see their own
    public class StudentAttendanceDto
    {
        public string CourseName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}