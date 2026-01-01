using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AMS.API.Models
{
    public class Attendance
    {
        [Key]
        public int Id { get; set; }

        public DateTime Date { get; set; } // The date of the lecture

        [Required]
        public string Status { get; set; } = "Present"; // "Present" or "Absent"

        // Link to Student
        public int StudentId { get; set; }
        [ForeignKey("StudentId")]
        public User? Student { get; set; }

        // Link to Course
        public int CourseId { get; set; }
        [ForeignKey("CourseId")]
        public Course? Course { get; set; }

        // Link to Section
        public int SectionId { get; set; }
        [ForeignKey("SectionId")]
        public Section? Section { get; set; }
    }
}