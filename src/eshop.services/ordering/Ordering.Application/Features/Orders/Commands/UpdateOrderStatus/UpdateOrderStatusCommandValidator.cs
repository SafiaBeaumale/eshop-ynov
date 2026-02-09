using FluentValidation;

namespace Ordering.Application.Features.Orders.Commands.UpdateOrderStatus;

/// <summary>
/// Validator for the <see cref="UpdateOrderStatusCommand"/>.
/// </summary>
public class UpdateOrderStatusCommandValidator : AbstractValidator<UpdateOrderStatusCommand>
{
    public UpdateOrderStatusCommandValidator()
    {
        RuleFor(x => x.OrderId)
            .NotEmpty()
            .WithMessage("Order Id is required");

        RuleFor(x => x.Status)
            .IsInEnum()
            .WithMessage("Status must be a valid OrderStatus value");
    }
}
