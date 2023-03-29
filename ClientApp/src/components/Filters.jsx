import React, { useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { Button } from './Button';
import Selector from './Selector';
import styles from './filters.module.css'

export default function Filters(props) {
    const Hooks = props.Hooks;
    const [prevDate, setPrevDate] = useState(props.prevDate)
    const [nextDate, setNextDate] = useState([props.nextDate])
    const selectorRef = useRef(null);
    const prevDateRef = useRef(null);
    const nextDateRef = useRef(null);
    const setDate = (prev = false) => {
        if (prev) {
            setPrevDate(prevDateRef.current?.value)
            Hooks.setPrevDate(prevDate);
        } else {
            setNextDate(nextDateRef.current?.value)
            Hooks.setNextDate(nextDate);
        }
    }
    const Update = () => {
        selectorRef.current?.setVisible();
        let filters = selectorRef.current?.getFilters();
        let sortBy = Hooks.getSortBy();
        let sort = Hooks.getSort();
        Hooks.setFilters(filters);
        //(_sortBy = "", _sort = "", _prevDate = "", _nextDate = "", _filters = [])
        Hooks.update(sortBy, sort, prevDate, nextDate, filters)

    }
    return <div className={styles.filter}>
        <Button link="/create">Создать заказ</Button>
        <input type="date" name="prevDate"
            defaultValue={prevDate} ref={prevDateRef} onChange={() => setDate(true)}></input>
        <input type="date" name="nextDate"
            defaultValue={nextDate} ref={nextDateRef} onChange={() => setDate(false)}></input>
        <Selector ref={selectorRef}></Selector>
        <Button onClick={Update}>Применить фильтрацию</Button>
    </div>
}