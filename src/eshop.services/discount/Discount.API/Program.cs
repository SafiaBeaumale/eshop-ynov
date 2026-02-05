using BuildingBlocks.Middlewares;
using Discount.API.Data;
using Discount.API.Data.Extensions;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

// CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

// Database - SQLite
builder.Services.AddDbContext<DiscountContext>(options =>
    options.UseSqlite(configuration.GetConnectionString("DiscountConnection")));

// OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

// Apply migrations on startup
app.UseCustomMigration();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

// Global Exception
app.UseMiddleware<ExceptionHandlerMiddleware>();

app.Run();
