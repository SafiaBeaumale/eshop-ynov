using Basket.API.Exceptions;
using Basket.API.Models;
using BuildingBlocks.Exceptions;
using Marten;

namespace Basket.API.Data.Repositories;

/// <summary>
/// Provides methods to interact with and manage shopping cart data storage.
/// </summary>
public class BasketRepository(IDocumentSession session) : IBasketRepository
{
    /// <summary>
    /// Deletes the shopping cart associated with the specified username.
    /// </summary>
    /// <param name="userName">The username for which the shopping cart needs to be deleted.</param>
    /// <param name="cancellationToken">Optional. A token to cancel the asynchronous operation.</param>
    /// <returns>A boolean indicating whether the deletion was successful.</returns>
    public async Task<bool> DeleteBasketAsync(string userName, CancellationToken cancellationToken = default)
    {
        session.Delete<ShoppingCart>(userName);
        await session.SaveChangesAsync(cancellationToken);
        return true;
    }

    /// <summary>
    /// Retrieves the shopping cart for the specified user by their username.
    /// </summary>
    /// <param name="userName">The username for which the shopping cart needs to be retrieved.</param>
    /// <param name="cancellationToken">Optional. A token to cancel the asynchronous operation.</param>
    /// <returns>The shopping cart associated with the specified username, or null if no such cart exists.</returns>
    /// <exception cref="BasketNotFoundException">Thrown when no shopping cart is found for the specified username.</exception>
    public async Task<ShoppingCart> GetBasketByUserNameAsync(string userName,
        CancellationToken cancellationToken = default)
    {
        var basket = await session.LoadAsync<ShoppingCart>(userName, cancellationToken);
        if(basket is null)
            throw new BasketNotFoundException(userName);
        
        return basket;
    }

    /// <summary>
    /// Creates a new shopping cart for the specified user.
    /// </summary>
    /// <param name="basket">The shopping cart instance to be created, containing the user's details and items.</param>
    /// <param name="cancellationToken">Optional. A token to cancel the asynchronous operation.</param>
    /// <returns>The created shopping cart instance.</returns>
    public async Task<ShoppingCart> CreateBasketAsync(ShoppingCart basket,
        CancellationToken cancellationToken = default)
    { 
        session.Store(basket);
        await session.SaveChangesAsync(cancellationToken);
        return basket;
    }

    /// <inheritdoc />
    public async Task<ShoppingCart> ValidateBasketAsync(string userName,
        CancellationToken cancellationToken = default)
    {
        var basket = await session.LoadAsync<ShoppingCart>(userName, cancellationToken);
        if (basket is null)
            throw new BasketNotFoundException(userName);

        session.Delete<ShoppingCart>(userName);
        await session.SaveChangesAsync(cancellationToken);

        return basket;
    }

    /// <inheritdoc />
    public async Task<ShoppingCart> AddItemAsync(string userName, ShoppingCartItem item,
        CancellationToken cancellationToken = default)
    {
        var basket = await session.LoadAsync<ShoppingCart>(userName, cancellationToken);
        if (basket is null)
            throw new BasketNotFoundException(userName);

        var items = basket.Items.ToList();
        var existingItem = items.FirstOrDefault(i => i.ProductId == item.ProductId);

        if (existingItem is not null)
        {
            existingItem.Quantity += item.Quantity;
        }
        else
        {
            items.Add(item);
        }

        basket.Items = items;
        session.Store(basket);
        await session.SaveChangesAsync(cancellationToken);

        return basket;
    }

    /// <inheritdoc />
    public async Task<ShoppingCart> UpdateItemQuantityAsync(string userName, Guid productId, int quantity,
        CancellationToken cancellationToken = default)
    {
        var basket = await session.LoadAsync<ShoppingCart>(userName, cancellationToken);
        if (basket is null)
            throw new BasketNotFoundException(userName);

        var item = basket.Items.FirstOrDefault(i => i.ProductId == productId);
        if (item is null)
            throw new NotFoundException("produit", productId);

        item.Quantity = quantity;
        session.Store(basket);
        await session.SaveChangesAsync(cancellationToken);

        return basket;
    }
}