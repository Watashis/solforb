import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchOrder, fetchProviders, fetchOrdersBypId, fetchOrdersItemsByoId, fetchUnits, createOrder } from '../api';
import InputSelect from '../components/InputSelect';
import { Button } from '../components/Button';
import styles from './createPage.module.css'

export default function CreatePage() {
    const navigate = useNavigate();
    const state = useLocation().state;

    const [provider, setProvider] = useState("")
    const [number, setNumber] = useState("")
    const [name, setName] = useState("")
    const [quantity, setQuantity] = useState("")
    const [unit, setUnit] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [create, setCreate] = useState(true);

    const providerRef = useRef(null);
    const numberRef = useRef(null);
    const nameRef = useRef(null);
    const quantityRef = useRef(null);
    const unitRef = useRef(null);
    const dateRef = useRef(null);

    useEffect(() => {
        checkEdit();
    }, []);

    const checkEdit = async () => {
        if (state != null) {
            if (state.order != null) {
                setCreate(false);
                setProvider(state.order.providerName)
                setNumber(state.order.number)
                setName(state.order.name)
                setQuantity(state.order.quantity)
                setUnit(state.order.unit)
                setDate(state.order.date.split('T')[0])
                providerRef.current.setValue(state.order.providerName, state.order.providerId);
                numberRef.current.setValue(state.order.number, state.order.orderId);
                nameRef.current.setValue(state.order.name, state.order.id);
            }
        }

    }
    const back = () => {
        if (create) {
            navigate("/", { replace: true })
        } else {
            navigate("/order", {
                state: {
                    providerId: state.order.providerId,
                    orderId: state.order.orderId,
                    orderItemId: state.order.id
                }
            });
        }
    }
    const save = async () => {
        let order = {
            "providerName": providerRef.current.getValue(),
            "number": numberRef.current.getValue(),
            "date": new Date(dateRef.current.value).toISOString(),
            "providerId": providerRef.current.getSelect(),
            "id": nameRef.current.getSelect(),
            "orderId": numberRef.current.getSelect(),
            "name": nameRef.current.getValue(),
            "quantity": quantityRef.current.getValue(),
            "unit": unitRef.current.getValue()
        }
        if(!create){
            order.providerId = state.order.providerId
            order.orderId = state.order.orderId
            order.id = state.order.id
        }
        let result = await createOrder(order);
        if(result.id!=undefined){
            navigate("/order", { replace: true, state: { providerId: result.providerId, orderId: result.orderId, orderItemId: result.id } });
        }
    }

    const updateUnits = async (u = undefined) => {
        let units = await fetchUnits();
        units = units.map((un, id) => {
            un.name = un.unit;
            un.id = id;
            return un
        })
        unitRef.current.setOptions(units);
        if (u != undefined) {
            unitRef.current.setValue(u, 0);
        }
    }

    const updateOrderItems = async (oid, fromOrder = false) => {
        let orderItems = await fetchOrdersItemsByoId(oid);
        nameRef.current.setOptions(orderItems);
        if (fromOrder) {
            nameRef.current.setValue(orderItems[0].name, orderItems[0].id);
            quantityRef.current.setValue(orderItems[0].quantity, 0);
            updateUnits(orderItems[0].unit)
        }
    }
    const updateOrders = async (pid, fromProvider = false) => {
        let orders = (await fetchOrdersBypId(pid)).map(order => {
            order.name = order.number;
            return order
        });
        numberRef.current.setOptions(orders);
        if (fromProvider) {
            numberRef.current.setValue(orders[0].name, orders[0].id);
            dateRef.current.value = orders[0].date.split('T')[0];
            updateOrderItems(orders[0].id, true)
        }
    }
    const update = async (to = "") => {
        if (to == "provider") {
            providerRef.current.setOptions(await fetchProviders())
            let providerId = providerRef.current.getSelect();
            if (providerId != undefined & providerId != -1) {
                updateOrders(providerId, true)
            }
        }
        if (to == "order") {
            let orderId = numberRef.current.getSelect();
            if (orderId != undefined) {
                let order = numberRef.current.getValueById(orderId);
                if (order != undefined) {
                    dateRef.current.value = order.date.split('T')[0];
                    updateOrderItems(orderId, true)
                }
            }
        }
    }
    return (
        <>
            <h3>{create ? "Создание заказа" : `Редактирование заказа ${state.order.number}`}</h3>

            <div className={styles.item}>
                Поставщик: <InputSelect text={provider} ref={providerRef} update={() => update("provider")}></InputSelect>
            </div>
            <div className={styles.item}>
                Номер заказа: <InputSelect text={number} ref={numberRef} update={() => update("order")}></InputSelect>
            </div>

            <div className={styles.item}>
                Дата: <input type="date" name="prevDate"
                    defaultValue={date} ref={dateRef}></input>
            </div>

            <div className={styles.item}>
                Наименование: <InputSelect text={name} ref={nameRef} update={() => update("")}></InputSelect>
            </div>

            <div className={styles.item}>
                Количество: <InputSelect text={quantity} ref={quantityRef} update={() => update("")} select={false}></InputSelect>
            </div>

            <div className={styles.item}>
                Единица измерения: <InputSelect text={unit} ref={unitRef} update={() => update("unit")}></InputSelect>
            </div>

            <div className={styles.btnBox}>
                <Button onClick={back}>Отмена</Button>
                <Button style="success" onClick={save}>Сохранить</Button>
            </div>
        </>
    )
}