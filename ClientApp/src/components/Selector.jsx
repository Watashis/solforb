import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import styles from './Selector.module.css'
import * as Api from '../api';

function FilterSelected(props) {
    return <div className={styles.selectedItem}>
        {props.children}
        <div className={styles.close} onClick={() => props.close(props.children)}>x</div>
    </div>
}

const Selector = forwardRef((props, ref) => {
    const [filters, setFilters] = useState([]);
    const [allFilters, setAllFilters] = useState([]);
    const [selectStyle, setSelectStyle] = useState(styles.select)
    useEffect(() => {
        fetchFilters()
    }, []);

    useImperativeHandle(ref, () => ({
        getFilters: () => {
            return filters
        },
        setVisible:()=>setVisible(undefined,true)
    }))
    const fetchFilters = async () => {
        setAllFilters(await Api.fetchFilters());
    }
    const setFilter = (filter) => {
        if (filters.includes(filter)) {
            setFilters(filters.filter(f => filter != f))
        } else {
            setFilters([...filters, filter])
        }
    }
    const setVisible = (e,always=false) => {
        let close = true;
        if(e!=undefined){
            close = e.target.className.indexOf("close") == -1
        }
        if (close) {
            let newStyle = `${styles.select} ${styles.active}`;
            if (selectStyle == newStyle) {
                setSelectStyle(styles.select);
            } else {
                if(!always){
                    setSelectStyle(newStyle);
                }
            }
        }
    }
    return <div className={styles.selector} >
        <div className={styles.selected} onClick={setVisible}>
            {filters.length === 0 ? 'Add Filters' : filters.map((filter, id) => <FilterSelected key={id} close={setFilter}>{filter}</FilterSelected>)}
        </div>
        <select multiple={true} className={selectStyle}>
            {allFilters.map((filter, id) => {
                return <option onClick={() => setFilter(filter)} key={id}>{filter}</option>
            })}
        </select>
    </div>
})

export default Selector;