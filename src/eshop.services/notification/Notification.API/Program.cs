using BuildingBlocks.Messaging.MassTransit;
using Notification.API.Extensions;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Add services to the container.
builder.Services
    .AddApiServices(configuration)
    .AddResendEmail(configuration);

builder.Services.AddMessageBroker(configuration, typeof(Program).Assembly);

var app = builder.Build();

app.UseApiServices();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.Run();
