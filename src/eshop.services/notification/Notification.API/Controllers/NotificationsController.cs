using Microsoft.AspNetCore.Mvc;
using Notification.API.Dtos;
using Notification.API.Services;

namespace Notification.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController(IEmailSender emailSender, ILogger<NotificationsController> logger) : ControllerBase
{
    [HttpPost("/email")]
    [Consumes("application/json")]
    public async Task<IActionResult> SendEmail([FromBody] SendEmailRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.To))
            return BadRequest("Recipient email is required.");

        if (string.IsNullOrWhiteSpace(request.Subject))
            return BadRequest("Email subject is required.");

        if (string.IsNullOrWhiteSpace(request.Html) && string.IsNullOrWhiteSpace(request.Text))
            return BadRequest("Email content is required (Html or Text).");

        var message = new EmailMessage(request.To, request.Subject, request.Html, request.Text);
        await emailSender.SendAsync(message, cancellationToken);

        logger.LogInformation("Notification email sent to {Recipient}", request.To);

        return Ok(new { status = "sent" });
    }
}
