import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './table.module.css'


const setSort = (sortBy, Hooks) => {
    let sort = Hooks.getSort();
    if (sortBy == Hooks.getSortBy()) {
        sort = sort * -1;
        Hooks.setSort(sort);
    } else {
        sort = 1;
        Hooks.setSort(sort);
        Hooks.setSortBy(sortBy);
    }
    Hooks.update(sortBy, sort);
}



export default function Table(props) {

    const navigate = useNavigate();
    const loadOrder = (providerId, orderId, orderItemId) => {
        navigate("/order", { replace: true, state: { providerId: providerId, orderId: orderId, orderItemId: orderItemId } });
    }
    return <>
        <table className="table table-striped">
            <thead>
                <tr>
                    <th onClick={() => setSort('provider', props.Hooks)}>Поставщик</th>
                    <th onClick={() => setSort('number', props.Hooks)}>Номер заказа</th>
                    <th onClick={() => setSort('name', props.Hooks)}>Наименование</th>
                    <th onClick={() => setSort('quantity', props.Hooks)}>Количество</th>
                    <th onClick={() => setSort('unit', props.Hooks)}>Ед. измерения</th>
                    <th onClick={() => setSort('date', props.Hooks)}>Дата</th>
                </tr>
            </thead>
            <tbody>
                {props.children.map(order => {
                    return <tr key={order.id} onClick={() => loadOrder(order.providerId, order.orderId, order.id)} className={styles.tr}>
                        <td>{order.providerName}</td>
                        <td>{order.number}</td>
                        <td>{order.name}</td>
                        <td>{order.quantity}</td>
                        <td>{order.unit}</td>
                        <td>{new Date(order.date).toISOString().split('T')[0]}</td>
                    </tr>
                })}
            </tbody>
        </table>
    </>
}