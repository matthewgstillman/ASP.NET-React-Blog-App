using BlogApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogApp.Models;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly BlogContext _context;

    public PostsController(BlogContext context)
    {
        _context = context;
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
            return NotFound(new { message = "Post not found." });
        }

        return Ok(post);
    }

    [HttpPost("{postId}/comments")]
    public async Task<ActionResult<Comment>> AddComment(int postId, [FromBody] CommentDTO request)
    {
        var post = await _context.Posts.FindAsync(postId);
        if (post == null)
        {
            return NotFound(new { message = "Post not found." });
        }

        if (string.IsNullOrWhiteSpace(request.Comment.Author) || string.IsNullOrWhiteSpace(request.Comment.Text))
        {
            return BadRequest(new { message = "Author and Text are required." });
        }

        var comment = new Comment
        {
            Author = request.Comment.Author,
            Text = request.Comment.Text,
            PostId = postId
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        return Ok(comment);
    }
}
