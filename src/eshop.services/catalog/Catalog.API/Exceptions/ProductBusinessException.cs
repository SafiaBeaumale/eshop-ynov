using BuildingBlocks.Exceptions;

namespace Catalog.API.Exceptions;

/// <summary>
/// Represents an exception that is thrown when an attempt is made to add a product
/// that already exists in the catalog. This exception is used to enforce the uniqueness
/// of product entries in the system.
/// </summary>
public class ProductAlreadyExistsException : AlreadyExistsException
{
    /// <summary>
    /// Represents an exception that is thrown when an attempt is made to add a product
    /// that already exists in the catalog. This exception is used to enforce the uniqueness
    /// of product entries in the system.
    /// </summary>
    public ProductAlreadyExistsException(string name)
        : base("Produit", "nom", name) { }
}

/// <summary>
/// Represents an exception that is thrown when a requested product cannot be found
/// in the catalog. This exception is used to indicate that an operation could not
/// be completed due to the absence of a product with the specified identifier.
/// </summary>
public class ProductNotFoundException : NotFoundException
{
    /// <summary>
    /// Represents an exception that is thrown when a requested product cannot be found
    /// in the catalog. This exception is used to indicate that an operation could not
    /// be completed due to the absence of a product with the specified identifier.
    /// </summary>
    public ProductNotFoundException(Guid id) : base("produit", id) { }
}

/// <summary>
/// Represents an exception that is thrown when the requested quantity exceeds the available stock for a product.
/// </summary>
public class InsufficientStockException : BusinessException
{
    public InsufficientStockException(Guid productId, int requested, int available)
        : base($"Stock insuffisant pour le produit '{productId}'. Demandé : {requested}, disponible : {available}.") { }
}
