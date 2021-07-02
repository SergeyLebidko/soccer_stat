import React from 'react';
import style from './DateSelector.module.css';
import commonStyle from '../common.module.css';

function DateSelector({dateFromRef, dateToRef, dateChangeHandler}) {
    return (
        <div className={style.date_container}>
            <span>
                От:
            </span>
            <input
                type="date"
                className={commonStyle.selector}
                ref={dateFromRef}
                onChange={dateChangeHandler}
            />
            <span>
                До:
            </span>
            <input
                type="date"
                className={commonStyle.selector}
                ref={dateToRef}
                onChange={dateChangeHandler}
            />
        </div>
    );
}

export default DateSelector;