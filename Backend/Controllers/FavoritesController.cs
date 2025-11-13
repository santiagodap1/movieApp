using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using System.ComponentModel.DataAnnotations;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FavoritesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> AddFavorite([FromBody] FavoriteDto favoriteDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userId, out var parsedUserId))
                return Unauthorized(new { message = "not valid Token" });

            var exists = await _context.Favorites
                .AnyAsync(f => f.UserId == parsedUserId && f.MovieId == favoriteDto.MovieId);

            if (exists)
                return Ok(new { success = true, message = "Favorite already exists" });

            var favorite = new Favorite
            {
                UserId = parsedUserId,
                MovieId = favoriteDto.MovieId,
                MovieTitle = favoriteDto.MovieTitle,
                PosterUrl = favoriteDto.PosterUrl
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, favorite });
        }

        [HttpDelete("{movieId}")]
        public async Task<IActionResult> RemoveFavorite(int movieId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userId, out var parsedUserId))
                return Unauthorized(new { message = "not valid Token" });

            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == parsedUserId && f.MovieId == movieId);

            if (favorite == null)
                return NotFound(new { message = "Favorite not found" });

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, movieId });
        }

        [HttpGet]
        public async Task<IActionResult> GetFavorites()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userId, out var parsedUserId))
                return Unauthorized(new { message = "not valid Token" });

            var favorites = await _context.Favorites
                .Where(f => f.UserId == parsedUserId)
                .ToListAsync();

            return Ok(favorites);
        }
    }

    public class FavoriteDto
    {
        [Required] public int MovieId { get; set; }
        [Required] public string MovieTitle { get; set; } = string.Empty;
        [Required] public string PosterUrl { get; set; } = string.Empty;
    }
}
