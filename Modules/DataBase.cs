
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System;

namespace solforb.Modules
{
    public class DataBase : DbContext
    {
        public DbSet<Order> Order { get; set; }
        public DbSet<OrderItem> OrderItem { get; set; }
        public DbSet<Provider> Provider { get; set; }
        public DbSet<Filters> Filters { get; set; }
        public DbSet<Unit> Unit { get; set; }
        public DataBase(DbContextOptions<DataBase> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
        public List<Orders> ProvidersToOrders(List<Provider> providers, FiltersPost filters)
        {
            List<Orders> orders = new();
            providers.ToList().ForEach(provider =>
            {
                provider.Orders?.ForEach(order =>
                {
                    if (order.Items != null)
                    {
                        if (order.Items.Any())
                        {
                            order.Items.ForEach(item =>
                            {
                                Orders FullOrder = new()
                                {
                                    number = order.number,
                                    Id = item.Id,
                                    Date = order.Date,
                                    ProviderId = provider.Id,
                                    ProviderName = provider.Name,
                                    OrderId = order.Id,
                                    Name = item.Name,
                                    Quantity = item.Quantity,
                                    Unit = item.Unit
                                };
                                orders.Add(FullOrder);
                            });
                        }
                    }
                });
            });
            filters.sort ??= 1;
            filters.sortBy ??= "provider";
            if (filters.sortBy == "provider")
                orders = orders.OrderBy(x => x.ProviderName).ToList();
            if (filters.sortBy == "number")
                orders = orders.OrderBy(x => x.number).ToList();
            if (filters.sortBy == "name")
                orders = orders.OrderBy(x => x.Name).ToList();
            if (filters.sortBy == "quantity")
                orders = orders.OrderBy(x => x.Quantity).ToList();
            if (filters.sortBy == "unit")
                orders = orders.OrderBy(x => x.Unit).ToList();
            if (filters.sortBy == "date")
                orders = orders.OrderBy(x => x.Date).ToList();
            if (filters.sort == -1)
            {
                orders.Reverse();
            }
            return orders;
        }
        public List<Orders> GetAll(FiltersPost filters)
        {
            var orders = Order.AsEnumerable().Where(order =>
            {
                if (order.Date > filters.prevDate & order.Date < filters.nextDate)
                {
                    if (filters.filters != null)
                    {
                        if (filters.filters.Any())
                        {
                            if (filters.filters.IndexOf(order.number) != -1)
                                return true;
                            else
                                return false;
                        }
                        else
                            return true;
                    }
                    else
                        return true;
                }
                else
                {
                    return false;
                }
            }).ToList();
            orders = orders.ConvertAll(order =>
            {
                order.Items = OrderItem.Where(o => o.OrderId == order.Id).AsEnumerable().Where(orderItem =>
                {
                    if (filters.filters != null)
                    {
                        if (filters.filters.Any())
                        {
                            if (filters.filters.IndexOf(orderItem.Name) != -1)
                                return true;
                            if (filters.filters.IndexOf(orderItem.Quantity?.ToString()) != -1)
                                return true;
                            if (filters.filters.IndexOf(orderItem.Unit) != -1)
                                return true;
                            return false;
                        }
                        else
                            return true;
                    }
                    else
                        return true;
                }).ToList();
                return order;
            }).ToList();
            List<Provider> providers = new();
            orders.ForEach(order =>
            {
                var _provider = Provider.Where(p => p.Id == order.ProviderId).AsEnumerable().Where(p =>
                {
                    if (filters.filters != null)
                        if (filters.filters.Any())
                            return filters.filters.IndexOf(p.Name) != -1;
                        else
                            return true;
                    else
                        return true;
                }).FirstOrDefault();
                if (_provider != null)
                {
                    var id = providers.IndexOf(_provider);
                    if (id != -1)
                    {
                        providers[id].Orders ??= new();
                        var orderId = providers[id].Orders.Where(o => o.Id == order.Id).FirstOrDefault();
                        if (orderId == null)
                            providers[id].Orders.Add(order);
                    }
                    else
                    {
                        _provider.Orders ??= new();
                        if (!_provider.Orders.Any())
                        {
                            _provider.Orders.Add(order);
                        }
                        providers.Add(_provider);
                    }
                }

            });
            return ProvidersToOrders(providers, filters);
        }
        public List<string?> GetFilters()
        {
            return Filters.OrderBy(filter => filter.name).ToList().ConvertAll(filter => filter.name?.Trim());
        }
        public Orders CreateOrder(Orders _order)
        {
            Provider? provider = new();
            Order? order = new();
            OrderItem? orderItem = new();
            if (_order.ProviderId == null)
            {
                provider.Name = _order.ProviderName;
                Provider.Add(provider);
            }
            else
            {
                provider = Provider.Where(p => p.Id == _order.ProviderId).FirstOrDefault();
                if (provider != null) {
                    provider.Name = _order.ProviderName;
                }
                else
                {
                    return new Orders();
                }
            }
            if (_order.OrderId == null)
            {
                order.number = _order.number;
                order.Date = _order.Date;
                order.ProviderId = _order.ProviderId;
                Order.Add(order);
            }
            else
            {
                order = Order.Where(o => o.Id == _order.OrderId).FirstOrDefault();
                if (order != null)
                {
                    order.number = _order.number;
                    order.Date = _order.Date;
                    order.ProviderId = _order.ProviderId;
                }
                else
                {
                    return new Orders();
                }
            }
            if (_order.Id != null)
            {
                orderItem = OrderItem.Where(oi => oi.Id == _order.Id).FirstOrDefault();
                if (orderItem != null)
                {
                    orderItem.Quantity = _order.Quantity;
                    orderItem.Unit = _order.Unit;
                    orderItem.Name = _order.Name;
                }
                else
                {
                    return new Orders();
                }
            }
            else
            {
                orderItem = new()
                {
                    Unit = _order.Unit,
                    Quantity = _order.Quantity,
                    OrderId = order.Id,
                    Name = _order.Name
                };
                OrderItem.Add(orderItem);
            }
            SaveChanges();
            _order.Id = orderItem.Id;
            _order.ProviderId = provider.Id;
            _order.OrderId = order.Id;
            order.ProviderId = provider.Id;
            orderItem.OrderId = order.Id;
            SaveChanges();
            return _order;
        }
        public bool DeleteOrder(Orders _order)
        {
            if (_order.Id != null)
            {
                var orderItem = OrderItem.Where(oi=>oi.Id==_order.Id).FirstOrDefault();
                if (orderItem != null)
                {
                    OrderItem.Remove(orderItem);
                    SaveChanges();
                }
            }
            else
            {
                return false;
            }
            if(_order.OrderId != null)
            {
                var order = Order.Where(o => o.Id == _order.OrderId).FirstOrDefault();
                if(order != null)
                {
                    var orderItems = OrderItem.Where(oi => oi.OrderId == order.Id).FirstOrDefault();
                    if (orderItems == null)
                    {
                        Order.Remove(order);
                        SaveChanges();
                    }
                }
            }
            if(_order.ProviderId!=null)
            {
                var provider = Provider.Where(p=>p.Id==_order.ProviderId).FirstOrDefault();
                if(provider != null)
                {
                    var orders = Order.Where(o=>o.ProviderId==provider.Id).FirstOrDefault();
                    if (orders == null)
                    {
                        Provider.Remove(provider);
                    }
                }
            }
            SaveChanges();
            return true;
        }
    
    }
}
