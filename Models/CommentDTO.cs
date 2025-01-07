namespace BlogApp.Models
{
    public class CommentDTO
    {
        public string Author { get; set; }
        public string Text { get; set; }
        public int PostId { get; set; }
    }
}