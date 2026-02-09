using System.Globalization;
using System.Net;
using System.Text;
using BuildingBlocks.Messaging.Events;
using MassTransit;
using Notification.API.Services;

namespace Notification.API.Features.Consumers;

/// <summary>
/// Sends an order confirmation email when a basket checkout event is received.
/// </summary>
public class BasketCheckoutNotificationConsumer(IEmailSender emailSender, ILogger<BasketCheckoutNotificationConsumer> logger)
    : IConsumer<BasketCheckoutEvent>
{
    public async Task Consume(ConsumeContext<BasketCheckoutEvent> context)
    {
        var message = context.Message;

        logger.LogInformation("Integration Event Handled: {IntegrationEvent}", message.GetType().Name);

        var subject = $"Order confirmation for {message.UserName}";
        var html = BuildOrderConfirmationHtml(message);
        var text = BuildOrderConfirmationText(message);

        var email = new EmailMessage(message.EmailAddress, subject, html, text);
        await emailSender.SendAsync(email, context.CancellationToken);
    }

    private static string BuildOrderConfirmationHtml(BasketCheckoutEvent message)
    {
        var builder = new StringBuilder();
        builder.Append("<h2>Order received</h2>");
        builder.Append("<p>Hi ").Append(WebUtility.HtmlEncode(message.FirstName)).Append(",</p>");
        builder.Append("<p>We received your order and it is being processed.</p>");
        builder.Append("<p><strong>Total:</strong> ")
            .Append(message.TotalPrice.ToString("0.00", CultureInfo.InvariantCulture))
            .Append("</p>");

        if (message.Items.Count > 0)
        {
            builder.Append("<ul>");
            foreach (var item in message.Items)
            {
                builder.Append("<li>")
                    .Append(WebUtility.HtmlEncode(item.ProductName))
                    .Append(" x ")
                    .Append(item.Quantity)
                    .Append(" - ")
                    .Append(item.Price.ToString("0.00", CultureInfo.InvariantCulture))
                    .Append("</li>");
            }
            builder.Append("</ul>");
        }

        builder.Append("<p>Thank you for your purchase.</p>");

        return builder.ToString();
    }

    private static string BuildOrderConfirmationText(BasketCheckoutEvent message)
    {
        var builder = new StringBuilder();
        builder.AppendLine("Order received");
        builder.AppendLine($"Hi {message.FirstName},");
        builder.AppendLine("We received your order and it is being processed.");
        builder.AppendLine($"Total: {message.TotalPrice.ToString("0.00", CultureInfo.InvariantCulture)}");

        if (message.Items.Count > 0)
        {
            builder.AppendLine("Items:");
            foreach (var item in message.Items)
            {
                builder.AppendLine($"- {item.ProductName} x {item.Quantity} - {item.Price.ToString("0.00", CultureInfo.InvariantCulture)}");
            }
        }

        builder.AppendLine("Thank you for your purchase.");
        return builder.ToString();
    }
}
