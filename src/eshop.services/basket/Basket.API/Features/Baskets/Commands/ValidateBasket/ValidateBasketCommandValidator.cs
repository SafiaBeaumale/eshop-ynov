using FluentValidation;

namespace Basket.API.Features.Baskets.Commands.ValidateBasket;

/// <summary>
/// Validator for the <see cref="ValidateBasketCommand"/>.
/// </summary>
/// <remarks>
/// This class is responsible for defining the validation logic for the <see cref="DeleteBasketCommand"/>.
/// It ensures that the required fields in the command are properly validated before execution.
/// </remarks>
public class ValidateBasketCommandValidator : AbstractValidator<ValidateBasketCommand>
{
    public ValidateBasketCommandValidator()
    {
        RuleFor(x => x.UserName).NotEmpty().WithMessage("UserName is required");
    }
}