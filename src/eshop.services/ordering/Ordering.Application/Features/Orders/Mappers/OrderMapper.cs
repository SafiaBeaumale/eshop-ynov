using Ordering.Application.Features.Orders.Dtos;
using Ordering.Domain.Models;

namespace Ordering.Application.Features.Orders.Mappers;

/// <summary>
/// Maps Order domain entities to DTOs.
/// </summary>
public static class OrderMapper
{
    /// <summary>
    /// Converts an Order domain entity to an OrderDto.
    /// </summary>
    public static OrderDto ToDto(Order order)
    {
        var shippingAddress = new AddressDto(
            order.ShippingAddress.FirstName,
            order.ShippingAddress.LastName,
            order.ShippingAddress.EmailAddress,
            order.ShippingAddress.AddressLine,
            order.ShippingAddress.State,
            order.ShippingAddress.Country,
            order.ShippingAddress.ZipCode);

        var billingAddress = new AddressDto(
            order.BillingAddress.FirstName,
            order.BillingAddress.LastName,
            order.BillingAddress.EmailAddress,
            order.BillingAddress.AddressLine,
            order.BillingAddress.State,
            order.BillingAddress.Country,
            order.BillingAddress.ZipCode);

        var payment = new PaymentDto(
            order.Payment.CardName,
            order.Payment.CardNumber,
            order.Payment.Expiration,
            order.Payment.CVV,
            order.Payment.PaymentMethod);

        var orderItems = order.OrderItems.Select(item => new OrderItemDto(
            item.OrderId.Value,
            item.ProductId.Value,
            item.ProductName,
            item.Quantity,
            item.Price)).ToList();

        return new OrderDto(
            order.Id.Value,
            order.CustomerId.Value,
            order.OrderName.Value,
            shippingAddress,
            billingAddress,
            payment,
            order.OrderStatus,
            orderItems);
    }
}
