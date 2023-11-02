import * as React from 'react';
import styles from './header.module.css';

export const Header = React.memo((props: { title: string, loading?: boolean }) => {
    return (
        <div className={styles.header}>
            <span className={styles.title}>{props.title}</span>
        </div>
    )
});