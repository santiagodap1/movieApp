using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/admin/favorites")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminFavoritesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminFavoritesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdminFavoriteResponse>>> GetAll()
        {
            var favorites = await _context.Favorites
                .AsNoTracking()
                .Include(f => f.User)
                .Select(f => new AdminFavoriteResponse
                {
                    Id = f.Id,
                    UserId = f.UserId,
                    MovieId = f.MovieId,
                    MovieTitle = f.MovieTitle,
                    PosterUrl = f.PosterUrl,
                    UserEmail = f.User.Email
                })
                .ToListAsync();
            return Ok(favorites);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var favorite = await _context.Favorites
                .Include(f => f.User)
                .Select(f => new AdminFavoriteResponse
                {
                    Id = f.Id,
                    UserId = f.UserId,
                    MovieId = f.MovieId,
                    MovieTitle = f.MovieTitle,
                    PosterUrl = f.PosterUrl,
                    UserEmail = f.User.Email
                })
                .FirstOrDefaultAsync(f => f.Id == id);

            if (favorite == null)
            {
                return NotFound();
            }

            return Ok(favorite);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AdminFavoriteDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
            if (!userExists)
            {
                return BadRequest(new { message = "User not found" });
            }

            var favorite = new Favorite
            {
                UserId = dto.UserId,
                MovieId = dto.MovieId,
                MovieTitle = dto.MovieTitle,
                PosterUrl = dto.PosterUrl
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = favorite.Id }, new AdminFavoriteResponse
            {
                Id = favorite.Id,
                UserId = favorite.UserId,
                MovieId = favorite.MovieId,
                MovieTitle = favorite.MovieTitle,
                PosterUrl = favorite.PosterUrl
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AdminFavoriteDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var favorite = await _context.Favorites.FindAsync(id);
            if (favorite == null)
            {
                return NotFound();
            }

            var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
            if (!userExists)
            {
                return BadRequest(new { message = "User not found" });
            }

            favorite.UserId = dto.UserId;
            favorite.MovieId = dto.MovieId;
            favorite.MovieTitle = dto.MovieTitle;
            favorite.PosterUrl = dto.PosterUrl;

            await _context.SaveChangesAsync();

            return Ok(new AdminFavoriteResponse
            {
                Id = favorite.Id,
                UserId = favorite.UserId,
                MovieId = favorite.MovieId,
                MovieTitle = favorite.MovieTitle,
                PosterUrl = favorite.PosterUrl
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var favorite = await _context.Favorites.FindAsync(id);
            if (favorite == null)
            {
                return NotFound();
            }

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class AdminFavoriteResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int MovieId { get; set; }
        public string MovieTitle { get; set; } = string.Empty;
        public string? PosterUrl { get; set; }
        public string? UserEmail { get; set; }
    }

    public class AdminFavoriteDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public int MovieId { get; set; }

        [Required]
        [StringLength(255)]
        public string MovieTitle { get; set; } = string.Empty;

        [StringLength(255)]
        public string PosterUrl { get; set; } = string.Empty;
    }
}
