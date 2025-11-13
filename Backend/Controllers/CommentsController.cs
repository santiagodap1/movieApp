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
    public class CommentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CommentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{movieId}")]
        public async Task<IActionResult> GetComments(int movieId)
        {
            var comments = await _context.Comments
                .Where(c => c.MovieId == movieId)
                .Include(c => c.User)
                .Select(c => new 
                {
                    c.Id,
                    c.Content,
                    c.CreatedAt,
                    User = new { c.User.Name }
                })
                .ToListAsync();

            return Ok(comments);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddComment([FromBody] CommentDto commentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userId, out var parsedUserId))
                return Unauthorized(new { message = "not valid Token" });

            var comment = new Comment
            {
                UserId = parsedUserId,
                MovieId = commentDto.MovieId,
                Content = commentDto.Content
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            
            var user = await _context.Users.FindAsync(parsedUserId);

            return Ok(new 
            { 
                success = true, 
                comment = new 
                {
                    comment.Id,
                    comment.Content,
                    comment.CreatedAt,
                    User = new { user.Name }
                }
            });
        }
    }

    public class CommentDto
    {
        [Required] public int MovieId { get; set; }
        [Required] public string Content { get; set; } = string.Empty;
    }
}
