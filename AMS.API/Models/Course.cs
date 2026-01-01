using System.ComponentModel.DataAnnotations;

namespace AMS.API.Models
{
    public class Course
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty; // e.g., "Operating Systems"

        [Required]
        public string Code { get; set; } = string.Empty; // e.g., "CSC300"

        public int CreditHours { get; set; }
    }
}