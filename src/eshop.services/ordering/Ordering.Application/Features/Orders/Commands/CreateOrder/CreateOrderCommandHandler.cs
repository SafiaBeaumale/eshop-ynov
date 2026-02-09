using BuildingBlocks.CQRS;
using Microsoft.EntityFrameworkCore;
using Ordering.Application.Features.Orders.Data;
using Ordering.Domain.Models;
using Ordering.Domain.ValueObjects;

namespace Ordering.Application.Features.Orders.Commands.CreateOrder;

public class CreateOrderCommandHandler (IOrderingDbContext orderingDbContext) : ICommandHandler<CreateOrderCommand, CreateOrderCommandResult>
{
    /// <summary>
    /// Handles the execution logic for creating an order command.
    /// </summary>
    /// <param name="request">The create order command containing the order details.</param>
    /// <param name="cancellationToken">A token to observe while waiting for the task to complete.</param>
    /// <returns>A task that represents the result of the handling operation, containing the newly created order's ID.</returns>
    public async Task<CreateOrderCommandResult> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        // Ensure the customer exists before creating the order
        var customerId = CustomerId.Of(request.Order.CustomerId);
        var customerExists = await orderingDbContext.Customers
            .AnyAsync(c => c.Id == customerId, cancellationToken);

        if (!customerExists)
        {
            var customer = Customer.Create(
                customerId,
                request.Order.ShippingAddress.FirstName + " " + request.Order.ShippingAddress.LastName,
                request.Order.ShippingAddress.EmailAddress);
            orderingDbContext.Customers.Add(customer);
        }

        var order = CreateOrderCommandMapper.CreateNewOrderFromDto(request.Order);
        orderingDbContext.Orders.Add(order);
        await orderingDbContext.SaveChangesAsync(cancellationToken);
        return new CreateOrderCommandResult(order.Id.Value);
    }
}