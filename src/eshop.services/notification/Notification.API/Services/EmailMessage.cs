namespace Notification.API.Services;

public sealed record EmailMessage(
    string To,
    string Subject,
    string? Html,
    string? Text
);
