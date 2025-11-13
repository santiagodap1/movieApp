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
    [Route("api/admin/comments")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminCommentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminCommentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdminCommentResponse>>> GetAll()
        {
            var comments = await _context.Comments
                .Include(c => c.User)
                .AsNoTracking()
                .Select(c => new AdminCommentResponse
                {
                    Id = c.Id,
                    MovieId = c.MovieId,
                    UserId = c.UserId,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    UserName = c.User.Name
                })
                .ToListAsync();
            return Ok(comments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var comment = await _context.Comments
                .Include(c => c.User)
                .Select(c => new AdminCommentResponse
                {
                    Id = c.Id,
                    MovieId = c.MovieId,
                    UserId = c.UserId,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    UserName = c.User.Name
                })
                .FirstOrDefaultAsync(c => c.Id == id);

            if (comment == null)
            {
                return NotFound();
            }

            return Ok(comment);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AdminCommentDto dto)
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

            var comment = new Comment
            {
                MovieId = dto.MovieId,
                UserId = dto.UserId,
                Content = dto.Content
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = comment.Id }, new AdminCommentResponse
            {
                Id = comment.Id,
                MovieId = comment.MovieId,
                UserId = comment.UserId,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AdminCommentUpdateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            if (dto.MovieId.HasValue)
            {
                comment.MovieId = dto.MovieId.Value;
            }

            if (dto.UserId.HasValue)
            {
                var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
                if (!userExists)
                {
                    return BadRequest(new { message = "User not found" });
                }
                comment.UserId = dto.UserId.Value;
            }

            if (!string.IsNullOrWhiteSpace(dto.Content))
            {
                comment.Content = dto.Content;
            }

            await _context.SaveChangesAsync();

            return Ok(new AdminCommentResponse
            {
                Id = comment.Id,
                MovieId = comment.MovieId,
                UserId = comment.UserId,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class AdminCommentDto
    {
        [Required]
        public int MovieId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(1000)]
        public string Content { get; set; } = string.Empty;
    }

    public class AdminCommentUpdateDto
    {
        public int? MovieId { get; set; }
        public int? UserId { get; set; }
        [StringLength(1000)]
        public string? Content { get; set; }
    }

    public class AdminCommentResponse
    {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = string.Empty;
        public System.DateTime CreatedAt { get; set; }
        public string? UserName { get; set; }
    }
}
