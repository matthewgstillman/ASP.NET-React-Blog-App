using BlogApp.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<BlogContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

DotNetEnv.Env.Load();

var adminToken = Environment.GetEnvironmentVariable("ADMIN_TOKEN");

if (!string.IsNullOrEmpty(adminToken))
{
    builder.Configuration["AdminToken"] = adminToken;
}
else
{
    Console.WriteLine("Warning: ADMIN_TOKEN not found in environment variables.");
}

var app = builder.Build();

app.UseCors("AllowReactApp");

app.MapControllers();

app.Run();