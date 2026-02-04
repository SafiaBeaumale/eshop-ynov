namespace Catalog.API.Exceptions;

public sealed class ProductsByCategoryNotFoundException : Exception
{
    public ProductsByCategoryNotFoundException(string category)
        : base($"No products found for category '{category}'.")
    {
    }
}