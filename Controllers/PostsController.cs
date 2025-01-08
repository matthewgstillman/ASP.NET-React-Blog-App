using BlogApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogApp.Models;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly BlogContext _context;
    private readonly IConfiguration _configuration;

    public PostsController(BlogContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Post>>> GetPosts()
    {
        var posts = await _context.Posts.Include(p => p.Comments).ToListAsync();
        return Ok(posts);
    }

    [HttpPost]
    public async Task<ActionResult<Post>> CreatePost(Post post)
    {
        if (string.IsNullOrWhiteSpace(post.Title) || string.IsNullOrWhiteSpace(post.Content))
        {
            return BadRequest(new { message = "Title and Content are required." });
        }

        post.CreatedAt = DateTime.UtcNow;
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPosts), new { id = post.Id }, post);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Post>> GetPostById(int id)
    {
        var post = await _context.Posts
            .Include(p => p.Comments)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (post == null)
        {
            Console.WriteLine($"Post with ID {id} not found.");
            return NotFound(new { message = "Post not found." });
        }

        return Ok(post);
    }

    [HttpPost("{postId}/comments")]
    public async Task<ActionResult<Comment>> AddComment(int postId, [FromBody] CommentDTO request)
    {
        var post = await _context.Posts.FindAsync(request.PostId);
        if (post == null)
        {
            return NotFound(new { message = "Post not found." });
        }

        if (string.IsNullOrWhiteSpace(request.Author) || string.IsNullOrWhiteSpace(request.Text))
        {
            return BadRequest(new { message = "Author and Text are required." });
        }

        var comment = new Comment
        {
            Author = request.Author,
            Text = request.Text,
            PostId = request.PostId
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        return Ok(comment);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id, [FromHeader(Name = "Authorization")] string token)
    {
        Console.WriteLine($"Delete request for post ID: {id}");
        
        var adminToken = Environment.GetEnvironmentVariable("ADMIN_TOKEN") 
                         ?? _configuration["AdminToken"];

        if (token != adminToken)
        {
            Console.WriteLine($"Unauthorized DELETE attempt for Post ID: {id}");
            return Unauthorized(new { message = "Unauthorized to delete posts." });
        }

        var post = await _context.Posts.FindAsync(id);
        if (post == null)
        {
            Console.WriteLine($"Post ID {id} not found.");
            return NotFound(new { message = "Post not found." });
        }

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();

        Console.WriteLine("Post deleted successfully.");
        return NoContent();
    }
}
