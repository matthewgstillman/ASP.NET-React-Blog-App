using BlogApp.Data;
using BlogApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
    public async Task<ActionResult<List<Post>>> GetPosts()
    {
        return await _context.Posts.Include(p => p.Comments).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Post>> CreatePost(Post post)
    {
        post.CreatedAt = DateTime.UtcNow;
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPosts), new { id = post.Id }, post);
    }

    [HttpPost("{postId}/comments")]
    public async Task<ActionResult<Comment>> AddComment(int postId, Comment comment)
    {
        var post = await _context.Posts.FindAsync(postId);
        if (post == null) return NotFound();

        comment.PostId = postId;
        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();
        return Ok(comment);
    }
}