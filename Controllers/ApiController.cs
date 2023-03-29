using Microsoft.AspNetCore.Mvc;
using solforb.Modules;
using System.Collections.Generic;

namespace solforb.Controllers
{
    [ApiController]
    [Route("api")]
    public class ApiController : ControllerBase
    {
        [HttpPost("get")]
        public List<Orders>? GetAll(DataBase dbContext, FiltersPost filters)
        {
            return dbContext.GetAll(filters);
        }
        [HttpGet("get/filters")]
        public List<string?> GetFilters(DataBase dbContext, string sortby = "provider", int sort = 1)
        {
            return dbContext.GetFilters();
        }
        [HttpGet("get/providers")]
        public List<Provider> GetProviders(DataBase dbContext)
        {
            return dbContext.Provider.ToList();
        }
        [HttpGet("get/orders/{providerId}")]
        public List<Order> GetOrders(DataBase dbContext, int providerId)
        {
            return dbContext.Order.Where(o => o.ProviderId == providerId).ToList();
        }
        [HttpGet("get/orderitems/{orderId}")]
        public List<OrderItem> GetOrderItems(DataBase dbContext, int orderId)
        {
            return dbContext.OrderItem.Where(o => o.OrderId == orderId).ToList();
        }
        [HttpGet("get/units")]
        public List<Unit> GetUnits(DataBase dbContext)
        {
            return dbContext.Unit.ToList();
        }
        [HttpGet("get/{providerId}/{orderId}/{orderItemId}")]
        public Orders? GetFromId(DataBase dbContext, int providerId,int orderId, int orderItemId)
        {
            var provider = dbContext.Provider.Where(p=>p.Id == providerId).FirstOrDefault();
            if(provider == null) return new Orders();

            var order = dbContext.Order.Where(o=>o.Id == orderId).FirstOrDefault();
            if(order==null) return new Orders();

            var orderItem = dbContext.OrderItem.Where(o=>o.Id==orderItemId).FirstOrDefault();
            if(orderItem==null) return new Orders();

            return new Orders()
            {
                Id = orderItemId,
                OrderId = orderId,
                ProviderId = providerId,
                Name = orderItem.Name,
                number = order.number,
                Date = order.Date,
                ProviderName = provider.Name,
                Quantity = orderItem.Quantity,
                Unit = orderItem.Unit
            };
        }


        [HttpPost("create")]
        public Orders GetAll(DataBase dbContext, Orders order)
        {
            dbContext.CreateOrder(order);
            return order;
        }

        [HttpPost("delete")]
        public string Delete(DataBase dbContext, Orders order)
        {
            var result =  dbContext.DeleteOrder(order);
            if (result)
                return "true";
            return "false";
        }
    }
}