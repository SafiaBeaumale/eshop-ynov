namespace Discount.Grpc.Models;

public class Coupon
{
    public int Id { get; set; }

    public string ProductName { get; set; } = string.Empty;  // Vide si IsGlobal = true

    public string Description { get; set; } = string.Empty;

    public double Amount { get; set; }  // Valeur (pourcentage ou montant selon Type)

    public DiscountType Type { get; set; } = DiscountType.FixedAmount;

    public bool IsGlobal { get; set; } = false;  // True = s'applique au panier entier
}