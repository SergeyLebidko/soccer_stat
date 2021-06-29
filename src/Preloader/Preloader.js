import React from 'react';
import style from './Preloader.module.css';

function Preloader(){
    return (
        <div className={style.container}>
            Загрузка...
        </div>
    );
}

export default Preloader;