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
        title: 'Лиги',
        exact: false
    },
    {
        href: '/team_list',
        title: 'Команды',
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
                            <NavLink exact={item.exact} to={item.href} activeClassName={style.selected_link}>
                                {item.title}
                            </NavLink>
                        </li>
                )}
            </ul>
        </nav>
    );
}

export default Navigation;