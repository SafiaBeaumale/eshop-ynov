namespace Notification.API.Dtos;

public sealed record SendEmailRequest(
    string To,
    string Subject,
    string? Html,
    string? Text
);
