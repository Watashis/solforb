import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchOrder } from '../api';
import styles from './InputSelect.module.css'

const InputSelect = forwardRef((props, ref) => {
    const [options, setOptions] = useState([]);
    const [allOptions, setAllOptions] = useState([]);
    const [selected, setSelected] = useState({ id: -1, value: "" });
    const [style, setStyle] = useState(styles.select)
    const [hideSelect, setHideSelect] = useState(true);
    const [focus, setFocus] = useState(false);

    const inputRef = useRef(null);
    const selectRef = useRef(null);

    useImperativeHandle(ref, () => ({
        getSelect: getSelect,
        setOptions: setOptions,
        setValue: (value, id) => {
            setSelected({ id: id, value: value });
            inputRef.current.value = value;
        },
        getValue:()=> inputRef.current.value,
        getValueById:(id)=>{
            let option = options.filter(o=>o.id==id);
            if(option.length>0){
                return option[0]
            }else{
                option = allOptions.filter(o=>o.id==id);
                if(option.length>0){
                    return option[0]
                }
            }
            return null;
        }
    }))

    useEffect(() => {
        //props.update();
    }, []);

    const onBlur = () => {
        setFocus(false);
        if (hideSelect) {
            setStyle(styles.select)
        }
    }

    const onFocus = () => {
        if(props.select!=false){
            setFocus(true);
            setStyle(`${styles.select} ${styles.active}`);
        }
    }

    const onMouseLeave = () => {
        setHideSelect(true);
        if (!focus) {
            setStyle(styles.select)
        }
    }

    const onMouseMove = () => {
        setHideSelect(false)
    }

    const getSelect = () => {
        let value = inputRef.current.value;
        if (value == selected.value) {
            return selected.id
        }else{
            let option = options.filter(o=>o.name==value);
            if(option.length>0){
                return option[0].id
            }else{
                option = allOptions.filter(o=>o.value==value);
                if(option.length>0){
                    return option[0].id
                }
            }
        }
    }

    const onChange = () => {
        props.update();
        let _options = allOptions;
        if (allOptions.length == 0) {
            setAllOptions(options);
            _options = options;
        }
        if (options.length > allOptions.length) {
            setAllOptions(options);
            _options = options;
        }
        _options = _options.filter(option => {
            let oValue = option.name.toLowerCase();
            let value = inputRef.current.value.toLowerCase();
            return oValue.indexOf(value) != -1
        });
        setOptions(_options);
    }

    const setSelect = (id, value) => {
        setSelected({ id: id, value: value })
        inputRef.current.value = value;
        setStyle(styles.select);
        props.update();

    }
    return (
        <div className={styles.block}>
            <input defaultValue={props.text} ref={inputRef} onFocus={onFocus} onBlur={onBlur} onChange={onChange}></input>
            <select multiple className={style} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} ref={selectRef}>
                {options.map(option => {
                    return <option key={option.id} value={option.id} onClick={() => setSelect(option.id, option.name)}>{option.name}</option>
                })}
            </select>
        </div>
    )
})

export default InputSelect;