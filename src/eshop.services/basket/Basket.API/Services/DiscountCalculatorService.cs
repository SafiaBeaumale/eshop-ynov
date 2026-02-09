using Basket.API.Models;
using Discount.Grpc;
using Grpc.Core;
using Microsoft.Extensions.Logging;

namespace Basket.API.Services;

public class DiscountCalculatorService(
    DiscountProtoService.DiscountProtoServiceClient discountClient,
    ILogger<DiscountCalculatorService> logger) : IDiscountCalculatorService
{
    public async Task<decimal> CalculateTotalAfterDiscountAsync(ShoppingCart cart, CancellationToken cancellationToken = default)
    {
        decimal totalAfterDiscount = 0;
        var globalCouponsApplied = new HashSet<int>();

        // Etape 1: Calculer le total par item avec les reductions produit
        foreach (var item in cart.Items)
        {
            var itemTotal = await CalculateItemTotalAsync(item, cancellationToken);
            totalAfterDiscount += itemTotal;
        }

        // Etape 2: Appliquer les reductions globales au total du panier
        totalAfterDiscount = await ApplyGlobalDiscountsAsync(totalAfterDiscount, cancellationToken);

        return Math.Max(0, totalAfterDiscount);
    }

    private async Task<decimal> CalculateItemTotalAsync(ShoppingCartItem item, CancellationToken cancellationToken)
    {
        decimal unitPrice = item.Price;

        try
        {
            // Recuperer tous les coupons pour ce produit (sans les globaux, ils seront appliques au total)
            logger.LogInformation("Fetching product discounts for '{ProductName}'", item.ProductName);
            var response = await discountClient.GetDiscountsAsync(
                new GetDiscountsRequest
                {
                    ProductName = item.ProductName,
                    IncludeGlobal = false
                },
                cancellationToken: cancellationToken);

            logger.LogInformation("GetDiscounts returned {Count} coupons for '{ProductName}'",
                response.Coupons.Count, item.ProductName);

            if (response.Coupons.Count > 0)
            {
                // Les coupons sont deja tries par le service (pourcentages d'abord)
                unitPrice = ApplyCoupons(unitPrice, response.Coupons);
            }
        }
        catch (RpcException ex)
        {
            logger.LogWarning(ex, "gRPC error fetching discounts for product '{ProductName}': {Status}",
                item.ProductName, ex.StatusCode);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error fetching discounts for product '{ProductName}'",
                item.ProductName);
        }

        var itemTotal = Math.Max(0, unitPrice) * item.Quantity;
        logger.LogDebug("Item {ProductName}: {Quantity} x {UnitPrice} = {ItemTotal}",
            item.ProductName, item.Quantity, unitPrice, itemTotal);

        return itemTotal;
    }

    private async Task<decimal> ApplyGlobalDiscountsAsync(decimal total, CancellationToken cancellationToken)
    {
        try
        {
            // Recuperer les coupons globaux (ProductName vide, includeGlobal = true)
            var response = await discountClient.GetDiscountsAsync(
                new GetDiscountsRequest
                {
                    ProductName = "",
                    IncludeGlobal = true
                },
                cancellationToken: cancellationToken);

            // Filtrer uniquement les coupons globaux
            var globalCoupons = response.Coupons.Where(c => c.IsGlobal).ToList();

            if (globalCoupons.Count > 0)
            {
                logger.LogInformation("Applying {Count} global coupons to cart total {Total}",
                    globalCoupons.Count, total);

                total = ApplyCoupons(total, globalCoupons);
            }
        }
        catch (RpcException ex)
        {
            logger.LogWarning(ex, "gRPC error fetching global discounts: {Status}", ex.StatusCode);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error fetching global discounts");
        }

        return total;
    }

    /// <summary>
    /// Applique une liste de coupons a un prix.
    /// Les coupons doivent etre tries: pourcentages d'abord, puis montants fixes.
    /// </summary>
    private decimal ApplyCoupons(decimal price, IEnumerable<CouponModel> coupons)
    {
        foreach (var coupon in coupons)
        {
            var previousPrice = price;

            if (coupon.Type == DiscountType.Percentage)
            {
                // Reduction en pourcentage: prix = prix * (1 - amount/100)
                var discountMultiplier = 1 - (decimal)coupon.Amount / 100;
                price *= discountMultiplier;
                logger.LogDebug("Applied {Percentage}% discount ({Description}): {PreviousPrice} -> {NewPrice}",
                    coupon.Amount, coupon.Description, previousPrice, price);
            }
            else // DiscountType.FixedAmount
            {
                // Reduction en montant fixe: prix = prix - amount
                price -= (decimal)coupon.Amount;
                logger.LogDebug("Applied {Amount} fixed discount ({Description}): {PreviousPrice} -> {NewPrice}",
                    coupon.Amount, coupon.Description, previousPrice, price);
            }

            // Empecher les prix negatifs pendant l'application
            price = Math.Max(0, price);
        }

        return price;
    }
}
