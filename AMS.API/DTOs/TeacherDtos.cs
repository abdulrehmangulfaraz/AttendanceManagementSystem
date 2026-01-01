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
}