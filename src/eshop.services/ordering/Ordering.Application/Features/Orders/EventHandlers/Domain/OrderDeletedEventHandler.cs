using MediatR;
using Microsoft.Extensions.Logging;
using Ordering.Domain.Events;

namespace Ordering.Application.Features.Orders.EventHandlers.Domain;

/// <summary>
/// Handles the domain event for an order being deleted.
/// This handler is responsible for processing the <see cref="OrderDeletedEvent"/>.
/// </summary>
public class OrderDeletedEventHandler(ILogger<OrderDeletedEventHandler> logger) : INotificationHandler<OrderDeletedEvent>
{
    /// <summary>
    /// Handles the domain event when an order is deleted.
    /// </summary>
    /// <param name="notification">The <see cref="OrderDeletedEvent"/> containing details of the deleted order.</param>
    /// <param name="cancellationToken">A cancellation token to observe while performing the operation.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public Task Handle(OrderDeletedEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation("Domain Event Handled: {DomainEvent} for Order {OrderId}",
            notification.GetType().Name,
            notification.Order.Id.Value);

        return Task.CompletedTask;
    }
}
