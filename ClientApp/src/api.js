const getDates = () => {
    let date = new Date();
    date.setMonth(date.getMonth() - 1)
    let prevDate = date.toISOString().split('T')[0]
    let nextDate = new Date().toISOString().split('T')[0]
    return [prevDate, nextDate]
}

const fetchOrders = async (sortBy, sort, prevDate, nextDate, filters) => {
    prevDate = new Date(prevDate);
    nextDate = new Date(nextDate);
    nextDate.setDate(nextDate.getDate() + 1)
    let data = {
        sortBy: sortBy,
        sort: sort,
        prevDate: prevDate,
        nextDate: nextDate,
        filters: filters
    }
    let response = await fetch('/api/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

const fetchFilters = async () => {
    const response = await fetch('/api/get/filters');
    return await response.json();
}

const fetchOrder = async (providerId, orderId, orderItemId) => {
    const response = await fetch(`/api/get/${providerId}/${orderId}/${orderItemId}`);
    return await response.json();
}

const fetchProviders = async () => {
    const response = await fetch('/api/get/providers');
    return await response.json();
}
const fetchOrdersBypId = async (providerId) => {
    const response = await fetch(`/api/get/orders/${providerId}`);
    return await response.json();
}
const fetchOrdersItemsByoId = async (orderId) => {
    const response = await fetch(`/api/get/orderitems/${orderId}`);
    return await response.json();
}
const fetchUnits = async () => {
    const response = await fetch('/api/get/units');
    return await response.json();
}
const createOrder = async (order) => {
    let response = await fetch('/api/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(order)
    });
    return await response.json();
}
const deleteOrder = async (order) => {
    let response = await fetch('/api/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(order)
    });
    return await response.text();
}
export { fetchOrders, fetchFilters, getDates, fetchOrder, fetchProviders, fetchOrdersBypId, fetchOrdersItemsByoId, fetchUnits,createOrder,deleteOrder }