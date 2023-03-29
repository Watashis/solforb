using Microsoft.EntityFrameworkCore;

namespace solforb.Modules
{
    public class Order
    {
        public int? Id { get; set; }
        public string? number { get; set; }
        public DateTime? Date { get; set; }
        public int? ProviderId { get; set; }
        public List<OrderItem>? Items { get; set; }
    }

    public class Provider
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public List<Order>? Orders { get; set; }
    }

    public class OrderItem
    {
        public int? Id { get; set; }
        public int? OrderId { get; set; }
        public string? Name { get; set; }
        public Decimal? Quantity { get; set; }
        public string? Unit { get; set; }
    }

    public class Orders: OrderItem
    {
        public string? ProviderName { get; set; }
        public string? number { get; set; }
        public DateTime? Date { get; set; }
        public int? ProviderId { get; set; }
    }

    [Keyless]
    public class Filters
    {
        public string? name { get; set; }
    }

    [Keyless]
    public class Unit
    {
        public string? unit { get; set; }
    }

    public class FiltersPost
    {
        public string? sortBy { get; set; }
        public int? sort { get; set; }
        public DateTime? prevDate { get; set; }
        public DateTime? nextDate { get; set; }
        public List<string>? filters { get; set; }
    }
}
