using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AMS.API.Models
{
    public class TeacherAllocation
    {
        [Key]
        public int Id { get; set; }

        // Link to User (Teacher)
        public int TeacherId { get; set; }
        [ForeignKey("TeacherId")]
        public User? Teacher { get; set; }

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