import React from 'react';
import {EARLIE_SEASON} from '../settings';
import style from './DateSelector.module.css';
import commonStyle from '../common.module.css';

function getDateFromString() {
    return `${EARLIE_SEASON}-01-01`;
}

function getDateToString() {
    let now = new Date();

    let y = now.getFullYear();
    let m = ('00' + (now.getMonth() + 1)).slice(-2);
    let d = ('00' + now.getDate()).slice(-2);

    return `${y}-${m}-${d}`;
}

function DateSelector({dateFromRef, dateToRef, dateFromDefault, dateToDefault, dateChangeHandler}) {
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
                defaultValue={dateFromDefault ? dateFromDefault : getDateFromString()}
            />
            <span>
                До:
            </span>
            <input
                type="date"
                className={commonStyle.selector}
                ref={dateToRef}
                onChange={dateChangeHandler}
                defaultValue={dateToDefault ? dateToDefault : getDateToString()}
            />
        </div>
    );
}

export default DateSelector;