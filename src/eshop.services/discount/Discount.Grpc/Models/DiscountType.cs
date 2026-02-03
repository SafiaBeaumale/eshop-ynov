namespace Discount.Grpc.Models;

public enum DiscountType
{
    Percentage = 0,   // Reduction en pourcentage (ex: 20 = -20%)
    FixedAmount = 1   // Reduction en montant fixe (ex: 5 = -5 euros)
}
