using Basket.API.Data.Repositories;
using BuildingBlocks.CQRS;

namespace Basket.API.Features.Baskets.Commands.ValidateBasket;

/// <summary>
/// Handles the execution of the <see cref="ValidateBasketCommand"/> to validate a user's shopping basket.
/// </summary>
/// <remarks>
/// Implements the <see cref="ICommandHandler{TCommand, TResponse}"/> interface to process the command within the CQRS architecture.
/// The handler utilizes an instance of <see cref="IBasketRepository"/> to perform the necessary operations for deleting the basket.
/// </remarks>
public class ValidateBasketCommandHandler(IBasketRepository repository) : ICommandHandler<ValidateBasketCommand, ValidateBasketCommandResult>
{
    /// <summary>
    /// Processes the request to handle the validation of a user's basket.
    /// </summary>
    /// <param name="request">The <see cref="ValidateBasketCommand"/> containing the user's basket data to validate.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A <see cref="Task"/> that represents the asynchronous operation, containing a <see cref="ValidateBasketCommandResult"/> which indicates whether the Validate operation was successful.</returns>
    public async Task<ValidateBasketCommandResult> Handle(ValidateBasketCommand request,
        CancellationToken cancellationToken)
    {
        await repository.ValidateBasketAsync(request.UserName, cancellationToken).ConfigureAwait(false);
       
       return new ValidateBasketCommandResult(true);
    }
}