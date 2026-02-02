using FluentValidation;

namespace Catalog.API.Features.Products.Commands.DeleteProduct;

/// <summary>
/// Validates the DeleteProductCommand to ensure the product Id is provided and valid.
/// </summary>
public class DeleteProductCommandValidator : AbstractValidator<DeleteProductCommand>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DeleteProductCommandValidator"/> class.
    /// Defines validation rules for the DeleteProductCommand.
    /// </summary>
    public DeleteProductCommandValidator()
    {
        RuleFor(cmd => cmd.Id)
            .NotEmpty()
            .WithMessage("Product Id is required and cannot be empty.");
    }
}