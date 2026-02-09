using Ordering.Domain.Enums;

namespace Ordering.Application.Features.Orders.Commands.UpdateOrderStatus;

/// <summary>
/// Request body for updating an order's status.
/// </summary>
/// <param name="Status">The new status for the order.</param>
public record UpdateOrderStatusRequest(OrderStatus Status);
