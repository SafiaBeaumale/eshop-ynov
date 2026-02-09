using BuildingBlocks.Exceptions;
using Discount.API.Data;
using Discount.API.Models;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Discount.API.Controllers;

[ApiController]
[Route("[controller]")]
[Produces("application/json")]
public class DiscountsController(DiscountContext dbContext, ILogger<DiscountsController> logger) : ControllerBase
{
    /// <summary>
    /// Recupere les reductions d'un produit par son nom.
    /// </summary>
    [HttpGet("product")]
    [ProducesResponseType(typeof(IEnumerable<Coupon>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Coupon>>> GetDiscount([FromQuery] string productName)
    {
        logger.LogInformation("Retrieving discounts for {ProductName}", productName);

        var coupons = await dbContext.Coupons
            .Where(x => x.ProductName == productName)
            .OrderBy(x => x.Type)
            .ThenByDescending(x => x.Amount)
            .ToListAsync();

        logger.LogInformation("Found {Count} discounts for {ProductName}", coupons.Count, productName);

        return Ok(coupons);
    }

    /// <summary>
    /// Recupere les reductions globales applicables au panier.
    /// </summary>
    [HttpGet("global")]
    [ProducesResponseType(typeof(IEnumerable<Coupon>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Coupon>>> GetDiscounts()
    {
        logger.LogInformation("Retrieving global discounts");

        var coupons = await dbContext.Coupons
            .Where(x => x.IsGlobal)
            .OrderBy(x => x.Type)
            .ThenByDescending(x => x.Amount)
            .ToListAsync();

        logger.LogInformation("Found {Count} global discounts", coupons.Count);

        return Ok(coupons);
    }

    /// <summary>
    /// Cree un nouveau coupon.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(Coupon), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Coupon>> CreateDiscount([FromBody] CreateCouponRequest request)
    {
        var coupon = request.Coupon;
        logger.LogInformation("Creating new discount for {ProductName}", coupon.ProductName);

        await dbContext.Coupons.AddAsync(coupon);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Discount created for {ProductName}: {Amount}", coupon.ProductName, coupon.Amount);

        return CreatedAtAction(nameof(GetDiscount), new { productName = coupon.ProductName }, coupon);
    }

    /// <summary>
    /// Recupere toutes les reductions (produit + globales).
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Coupon>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Coupon>>> GetAllDiscounts()
    {
        var coupons = await dbContext.Coupons
            .OrderBy(x => x.Type)
            .ThenByDescending(x => x.Amount)
            .ToListAsync();

        return Ok(coupons);
    }

    /// <summary>
    /// Met a jour un coupon existant.
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(Coupon), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Coupon>> UpdateDiscount(int id, [FromBody] CreateCouponRequest request)
    {
        logger.LogInformation("Updating discount for Id {Id}", id);

        var coupon = await dbContext.Coupons.FirstOrDefaultAsync(x => x.Id == id);

        if (coupon is null)
            throw new NotFoundException("Coupon", id);

        coupon.ProductName = request.Coupon.ProductName;
        coupon.Description = request.Coupon.Description;
        coupon.Amount = request.Coupon.Amount;
        coupon.Type = request.Coupon.Type;
        coupon.IsGlobal = request.Coupon.IsGlobal;

        dbContext.Coupons.Update(coupon);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Discount updated for {ProductName}: {Amount}", coupon.ProductName, coupon.Amount);

        return Ok(coupon);
    }

    /// <summary>
    /// Supprime un coupon par son identifiant.
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<object>> DeleteDiscount(int id)
    {
        logger.LogInformation("Deleting discount for Id {Id}", id);

        var coupon = await dbContext.Coupons.FirstOrDefaultAsync(x => x.Id == id);

        if (coupon is null)
            throw new NotFoundException("Coupon", id);

        dbContext.Coupons.Remove(coupon);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Discount deleted for {ProductName}", coupon.ProductName);

        return Ok(new { Success = true });
    }
}
