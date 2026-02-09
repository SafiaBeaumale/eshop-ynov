using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.Extensions.Options;
using Notification.API.Options;

namespace Notification.API.Services;

public class ResendEmailSender(HttpClient httpClient, IOptions<ResendOptions> options, ILogger<ResendEmailSender> logger)
    : IEmailSender
{
    public async Task SendAsync(EmailMessage message, CancellationToken cancellationToken)
    {
        var resendOptions = options.Value;

        if (string.IsNullOrWhiteSpace(message.To))
            throw new ArgumentException("Recipient email is required.", nameof(message));

        if (string.IsNullOrWhiteSpace(message.Subject))
            throw new ArgumentException("Email subject is required.", nameof(message));

        if (string.IsNullOrWhiteSpace(message.Html) && string.IsNullOrWhiteSpace(message.Text))
            throw new ArgumentException("Email content is required (Html or Text).", nameof(message));

        var from = "onboarding@resend.dev";
        using var request = new HttpRequestMessage(HttpMethod.Post, "emails");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", resendOptions.ApiKey);

        var payload = new
        {
            from,
            to = new[] { message.To },
            subject = message.Subject,
            html = message.Html,
            text = message.Text
        };

        request.Content = JsonContent.Create(payload);

        var response = await httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            logger.LogError("Resend email failed with status {StatusCode}: {Body}", response.StatusCode, body);
        }

        response.EnsureSuccessStatusCode();
    }
}
