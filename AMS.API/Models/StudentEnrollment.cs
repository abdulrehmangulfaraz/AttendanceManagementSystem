using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AMS.API.Models
{
    public class StudentEnrollment
    {
        [Key]
        public int Id { get; set; }

        // Link to User (Student)
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

        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
    }
}