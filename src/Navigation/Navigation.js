import React from 'react';
import {Link} from 'react-router-dom';
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
        exact: true
    },
    {
        href: '/team_list',
        title: 'Команды',
        exact: true
    }
];

function Navigation() {
    return (
        <nav>
            <ul>
                {navigationData.map(
                    item =>
                        <li key={item.href}>
                            <Link exact={item.exact} to={item.href}>
                                {item.title}
                            </Link>
                        </li>
                )}
            </ul>
        </nav>
    );
}

export default Navigation;