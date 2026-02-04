using Ordering.Domain.Abstractions;
using Ordering.Domain.Models;

namespace Ordering.Domain.Events;

/// <summary>
/// Represents a domain event that occurs when an order is deleted.
/// </summary>
public record OrderDeletedEvent(Order Order) : IDomainEvent;
