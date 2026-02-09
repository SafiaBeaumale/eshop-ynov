using BuildingBlocks.CQRS;
using Ordering.Domain.Enums;

namespace Ordering.Application.Features.Orders.Commands.UpdateOrderStatus;

/// <summary>
/// Represents a command to update the status of an existing order.
/// </summary>
/// <param name="OrderId">The unique identifier of the order to update.</param>
/// <param name="Status">The new status to set for the order.</param>
public record UpdateOrderStatusCommand(Guid OrderId, OrderStatus Status) : ICommand<UpdateOrderStatusCommandResult>;
