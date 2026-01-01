using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AMS.API.Models
{
    public class Section
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty; // e.g., "BSCS-5A"

        // Foreign Key to AcademicSession
        public int AcademicSessionId { get; set; }

        [ForeignKey("AcademicSessionId")]
        public AcademicSession? AcademicSession { get; set; }
    }
}