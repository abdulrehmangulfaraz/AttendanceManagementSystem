using System.ComponentModel.DataAnnotations;

namespace AMS.API.Models
{
    public class TimetableEntry
    {
        public int Id { get; set; }
        public string Day { get; set; } = string.Empty; // e.g., "Monday"
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string Room { get; set; } = string.Empty;

        // Relationships
        public int SectionId { get; set; }
        public Section? Section { get; set; }

        public int CourseId { get; set; }
        public Course? Course { get; set; }
    }
}