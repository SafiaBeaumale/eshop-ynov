using Basket.API.Models;

namespace Basket.API.Services;

public interface IDiscountCalculatorService
{
    /// <summary>
    /// Calcule le total du panier apres application de toutes les reductions.
    /// </summary>
    /// <param name="cart">Le panier a calculer</param>
    /// <param name="cancellationToken">Token d'annulation</param>
    /// <returns>Le total apres reductions</returns>
    Task<decimal> CalculateTotalAfterDiscountAsync(ShoppingCart cart, CancellationToken cancellationToken = default);
}
