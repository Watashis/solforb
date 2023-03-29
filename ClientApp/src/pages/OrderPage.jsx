import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchOrder,deleteOrder } from '../api';
import styles from './orderPage.module.css'
import { Button } from '../components/Button';

export default function OrderPage() {
    const navigate = useNavigate();
    const state = useLocation().state;
    const [order, setOrder] = useState(null)
    const getOrder = () => {
        return <div>
            <div>Дата: {order.date.split('T')[0]}</div>
            <div>Поставщик: {order.providerName}</div>
            <div>Номер заказа: {order.number}</div>
            <div>Наименование: {order.name}</div>
            <div>Количество: {order.quantity} {order.unit}</div>
        </div>
    }
    useEffect(() => {
        fetch();
    }, []);
    const fetch = async () => {
        if (state.providerId == null | state.orderId == null | state.orderItemId == null) {
            navigate("/", { replace: true });
        } else {
            setOrder(await fetchOrder(state.providerId, state.orderId, state.orderItemId));
        }

    }
    const Delete = async ()=>{
        var result = await deleteOrder(order);
        if(result=="true"){
            navigate("/", { replace: true });
        }else{
            alert("Возникла непредвиденная ошибка, повторите запрос позднее")
        }
    }
    return (<>
        <div className={styles.btnBox}>
            <Button onClick={() => navigate("/edit", { replace: true, state: { order: order } })}>Редактировать</Button>
            <Button style="danger" onClick={Delete}>Удалить</Button>
            <Button style="success" link="/">Готово</Button>
        </div>
        {order == null ? <div>loading</div> : getOrder()}
    </>)
}