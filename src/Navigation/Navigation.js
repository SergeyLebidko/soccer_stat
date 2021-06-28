import React from 'react';
import {NavLink} from 'react-router-dom';
import style from './Navigation.module.css';

const navigationData = [
    {
        href: '/',
        title: 'Главная',
        exact: true
    },
    {
        href: '/competition_list',
        title: 'Список лиг',
        exact: false
    },
    {
        href: '/team_list',
        title: 'Список команд',
        exact: false
    },
    {
        href: '/competition_calendar',
        title: 'Календарь лиги',
        exact: false
    },
    {
        href: '/team_calendar',
        title: 'Календарь команды',
        exact: false
    },
];

function Navigation() {
    return (
        <nav>
            <ul>
                {navigationData.map(
                    item =>
                        <li key={item.href}>
                            <NavLink exact={item.exact} to={item.href} activeClassName={style.selected}>
                                {item.title}
                            </NavLink>
                        </li>
                )}
            </ul>
        </nav>
    );
}

export default Navigation;