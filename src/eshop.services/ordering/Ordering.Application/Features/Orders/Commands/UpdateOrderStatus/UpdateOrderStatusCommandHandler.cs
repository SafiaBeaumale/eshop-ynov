using BuildingBlocks.CQRS;
using Microsoft.EntityFrameworkCore;
using Ordering.Application.Features.Orders.Data;
using Ordering.Domain.Exceptions;
using Ordering.Domain.ValueObjects.Types;

namespace Ordering.Application.Features.Orders.Commands.UpdateOrderStatus;

/// <summary>
/// Handles the update order status command, allowing the modification of an order's status.
/// </summary>
public class UpdateOrderStatusCommandHandler(IOrderingDbContext orderingDbContext)
    : ICommandHandler<UpdateOrderStatusCommand, UpdateOrderStatusCommandResult>
{
    public async Task<UpdateOrderStatusCommandResult> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        var orderId = OrderId.Of(request.OrderId);

        var order = await orderingDbContext.Orders
            .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);

        if (order is null)
        {
            throw new OrderNotFoundException(request.OrderId);
        }

        order.UpdateStatus(request.Status);

        await orderingDbContext.SaveChangesAsync(cancellationToken);

        return new UpdateOrderStatusCommandResult(true);
    }
}
