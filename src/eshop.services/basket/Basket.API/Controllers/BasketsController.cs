using Basket.API.Features.Baskets.Commands.AddItem;
using Basket.API.Features.Baskets.Commands.CheckOutBasket;
using Basket.API.Features.Baskets.Commands.CreateBasket;
using Basket.API.Features.Baskets.Commands.DeleteBasket;
using Basket.API.Features.Baskets.Commands.UpdateItemQuantity;
using Basket.API.Features.Baskets.Commands.ValidateBasket;
using Basket.API.Features.Baskets.Commands.DeleteBasketItem;
using Basket.API.Features.Baskets.Queries.GetBasketByUserName;
using Basket.API.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Basket.API.Controllers;

/// <summary>
/// The BasketsController is responsible for handling HTTP requests related to user baskets in the basket service.
/// It provides endpoints to retrieve the shopping basket for a specific user.
/// </summary>
[ApiController]
[Route("[controller]/{userName}")]
[Produces("application/json")]
public class BasketsController (ISender sender) : ControllerBase
{
    /// <summary>
    /// Retrieves the shopping basket for the specified user.
    /// </summary>
    /// <param name="userName">The username whose shopping basket is to be retrieved.</param>
    /// <returns>The shopping basket associated with the specified username or a not-found response if no basket exists.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ShoppingCart), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(NotFoundObjectResult), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShoppingCart>> GetBasketByUserName(string userName)
    {
        var result = await sender.Send(new GetBasketByUserNameQuery(userName));
        return Ok(result.ShoppingCart);
    }

    /// <summary>
    /// Creates a shopping basket for the specified user based on the given request data.
    /// </summary>
    /// <param name="userName">The username for whom the shopping basket is to be created.</param>
    /// <param name="request">The request containing the details of the shopping basket to be created.</param>
    /// <returns>The result of the create basket operation, including success status and associated username.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(CreateBasketCommandResult), StatusCodes.Status201Created)]
    public async Task<ActionResult<CreateBasketCommandResult>> CreateBasket(string userName, [FromBody] CreateBasketCommand request)
    {
        var result = await sender.Send(request);
        return CreatedAtAction(nameof(GetBasketByUserName), new { userName }, result);
    }

    /// <summary>
    /// Deletes a specific item from the shopping basket for the specified user.
    /// </summary>
    /// <param name="userName">The username whose shopping basket item is to be deleted.</param>
    /// <param name="productId">The product ID of the item to delete.</param>
    /// <returns>A boolean value indicating whether the item was successfully deleted or a not-found response if the item doesn't exist.</returns>
    [HttpDelete("items/{productId:guid}")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(NotFoundObjectResult), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<bool>> DeleteBasketItem(string userName, Guid productId)
    {
        var result = await sender.Send(new DeleteBasketItemCommand(userName, productId));
        
        if (!result.IsSuccess)
        {
            return NotFound($"Item with ProductId {productId} not found in basket for user {userName}");
        }
        
        return Ok(result.IsSuccess);
    }
    
    /// <summary>
    /// Deletes the shopping basket for the specified user.
    /// </summary>
    /// <param name="userName">The username whose shopping basket is to be deleted.</param>
    /// <returns>A boolean value indicating whether the basket was successfully deleted or a not-found response if no basket exists for the user.</returns>
    [HttpDelete]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(NotFoundObjectResult), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<bool>> DeleteBasket(string userName)
    {
        var result = await sender.Send(new DeleteBasketCommand(userName));
        return Ok(result.IsSuccess);
    }
    
    /// <summary>
    /// Validates and checks out the shopping basket for the specified user.
    /// </summary>
    /// <param name="userName">The username whose shopping basket is to be checked out.</param>
    /// <returns>A result indicating whether the checkout was successful.</returns>
    [HttpPost("checkout")]
    [ProducesResponseType(typeof(ValidateBasketCommandResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(NotFoundObjectResult), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ValidateBasketCommandResult>> Checkout(string userName)
    {
        var result = await sender.Send(new ValidateBasketCommand(userName));
        return Ok(result);
    }

    /// <summary>
    /// Adds an item to the shopping basket for the specified user.
    /// </summary>
    /// <param name="userName">The username whose shopping basket will be updated.</param>
    /// <param name="command">The command containing the item to add.</param>
    /// <returns>The result of the add item operation, including the updated cart.</returns>
    [HttpPost("items")]
    [ProducesResponseType(typeof(AddItemCommandResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(NotFoundObjectResult), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AddItemCommandResult>> AddItem(string userName, [FromBody] AddItemCommand command)
    {
        var result = await sender.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Updates the quantity of a specific product in the user's shopping basket.
    /// </summary>
    /// <param name="userName">The username whose shopping basket will be updated (from URL).</param>
    /// <param name="request">The request containing the product ID and new quantity.</param>
    /// <returns>The result of the update operation, including the updated cart.</returns>
    [HttpPut("items")]
    [ProducesResponseType(typeof(UpdateItemQuantityCommandResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(NotFoundObjectResult), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UpdateItemQuantityCommandResult>> UpdateItemQuantity(string userName, [FromBody] UpdateItemQuantityRequest request)
    {
        var command = new UpdateItemQuantityCommand(userName, request.ProductId, request.Quantity);
        var result = await sender.Send(command);
        return Ok(result);
        
    // TODO Update basket product quantity
    
    //TODO Delete item in user basket
    
    /// <summary>
    /// Processes the checkout operation for the specified user's basket.
    /// </summary>
    /// <param name="userName">The username whose basket is to be checked out.</param>
    /// <param name="request">The details of the checkout request, including basket information.</param>
    /// <returns>The result of the checkout operation, indicating success or failure status.</returns>
    [HttpPost("Checkout")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status201Created)]
    public async Task<ActionResult<bool>> CheckOutBasket(string userName, [FromBody] CheckOutBasketCommand request)
    {
        request.BasketCheckoutDto.UserName = userName;
        var result = await sender.Send(request);
        return Ok(result.IsSuccess);
    }
}