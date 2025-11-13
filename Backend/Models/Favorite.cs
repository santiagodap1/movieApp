using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Favorite
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int MovieId { get; set; }

        [Required]
        [StringLength(255)]
        public string MovieTitle { get; set; } = string.Empty;

        [StringLength(255)]
        public string PosterUrl { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
    }
}
