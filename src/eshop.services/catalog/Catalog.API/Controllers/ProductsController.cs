using Catalog.API.Features.Products.Commands.CreateProduct;
using Catalog.API.Features.Products.Commands.DecrementStock;
using Catalog.API.Features.Products.Commands.DeleteProduct;
using Catalog.API.Features.Products.Commands.UpdateProduct;
using Catalog.API.Features.Products.Queries.GetProductByCategory;
using Catalog.API.Features.Products.Commands.ImportProducts;
using Catalog.API.Features.Products.Queries.GetProductById;
using Catalog.API.Features.Products.Queries.GetProductStock;
using Catalog.API.Features.Products.Queries.GetProductAll;
using Catalog.API.Features.Products.Queries.ExportProducts;
using Catalog.API.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Catalog.API.Controllers;

/// <summary>
/// Manages operations related to products within the catalog, including retrieving product data
/// and creating new products.
/// </summary>
[ApiController]
[Route("[controller]")]
[Produces("application/json")]
public class ProductsController(ISender sender) : ControllerBase
{
    /// <summary>
    /// Retrieves the stock quantity for a product by its unique identifier.
    /// Use GET /Products/stock/{id} to avoid route conflicts with GET /Products/{id}.
    /// </summary>
    /// <param name="id">The unique identifier of the product.</param>
    /// <returns>The product id and current stock quantity; 404 if the product is not found.</returns>
    [HttpGet("stock/{id:guid}")]
    [ProducesResponseType(typeof(GetProductStockQueryResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(NotFoundObjectResult), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetProductStockQueryResult>> GetProductStock(Guid id)
    {
        var result = await sender.Send(new GetProductStockQuery(id));
        return Ok(result);
    }

    /// <summary>
    /// Retrieves a product by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the product to retrieve.</param>
    /// <returns>The product matching the specified identifier, if found; otherwise, a not found response.</returns>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(Product), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(NotFoundObjectResult), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Product>> GetProductById(Guid id)
    {
        var result = await sender.Send(new GetProductByIdQuery(id));
        return Ok(result.Product);

    }

    /// <summary>
    /// Retrieves a collection of products within a specified category.
    /// </summary>
    /// <param name="category">The category by which to filter the products.</param>
    /// <returns>A collection of products belonging to the specified category, if found; otherwise, a bad request response.</returns>
    [HttpGet("category/{category}")]
    [ProducesResponseType(typeof(IEnumerable<Product>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BadRequestObjectResult), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Product>> GetProductsByCategory(string category)
    {
        if (string.IsNullOrWhiteSpace(category))
            return BadRequest("Category is required");
        
        var result = await sender.Send(new GetProductByCategoryQuery(category));
        return Ok(result.Products);
    }

    /// <summary>
    /// Retrieves a collection of products from the catalog.
    /// </summary>
    /// <returns>A collection of products wrapped in an action result.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Product>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        if (pageNumber < 1 || pageSize < 1)
            return BadRequest("PageNumber and PageSize must be greater than 0");
    
        var result = await sender.Send(new GetProductAllQuery(pageNumber, pageSize)); 
        return Ok(result.Products);
    }

    /// <summary>
    /// Handles the creation of a new product.
    /// </summary>
    /// <param name="request">The command containing the details of the product to be created.</param>
    /// <returns>A result object containing the ID of the newly created product.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(CreateProductCommandResult), StatusCodes.Status201Created)]
    public async Task<ActionResult<CreateProductCommandResult>> CreateProduct(CreateProductCommand request)
    {
        var result = await sender.Send(request);
        return CreatedAtAction(nameof(GetProductById), new { id = result.Id }, result);
    }

    /// <summary>
    /// Updates a product with the specified ID using the provided update details.
    /// </summary>
    /// <param name="id">The unique identifier of the product to update.</param>
    /// <param name="request">The details to update the specified product.</param>
    /// <returns>A boolean indicating whether the update was successful or an appropriate error response if the product was not found.</returns>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(NotFoundObjectResult), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<bool>> UpdateProduct(Guid id, [FromBody] UpdateProductCommand request)
    {
        var result = await sender.Send(request);
        return Ok(result.IsSuccessful);
    }

    /// <summary>
    /// Decrements stock for the given products (e.g. when an order is placed).
    /// </summary>
    /// <param name="command">The command containing the list of product id and quantity to decrement.</param>
    /// <returns>True if the operation succeeded; 400 if stock is insufficient; 404 if a product is not found.</returns>
    [HttpPost("decrement-stock")]
    [ProducesResponseType(typeof(DecrementStockCommandResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(NotFoundObjectResult), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(BadRequestObjectResult), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<DecrementStockCommandResult>> DecrementStock([FromBody] DecrementStockCommand command)
    {
        var result = await sender.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Deletes a product by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the product to delete.</param>
    /// <returns>True if the product was successfully deleted; otherwise, a not found response.</returns>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(NotFoundObjectResult), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<bool>> DeleteProduct(Guid id)
    {
        // Create command only from route parameter
        var command = new DeleteProductCommand(id);
        var result = await sender.Send(command);
        return Ok(result.IsSuccessful);
    }

    /// <summary>
    /// Imports products from an uploaded Excel file.
    /// </summary>
    /// <param name="file">The Excel file (.xlsx) containing product data.</param>
    /// <returns>The number of products imported.</returns>
    [HttpPost("import")]
    [ProducesResponseType(typeof(ImportProductsCommandResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BadRequestObjectResult), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ImportProductsCommandResult>> ImportProducts(IFormFile file)
    {
        var command = new ImportProductsCommand(file);
        var result = await sender.Send(command);
        return Ok(result);
    }
    
    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    [HttpGet("export")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ExportProducts()
    {
        var result = await sender.Send(new ExportProductsQuery());

        return File(
            result.FileContent,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            result.FileName
        );
    }
}