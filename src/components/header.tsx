import * as React from 'react';
import styles from './header.module.css';
import { ModeToggle } from './mode-toggle';

export const Header = React.memo((props: { title: any, right?: any }) => {
    return (
        <div className='flex flex-row justify-center'>
            <div className={styles.header}>
                <span className={styles.title}>{props.title}</span>
                <div className='flex flex-row gap-[8px]'>
                    {props.right}
                    <ModeToggle />
                </div>
            </div>
        </div>
    )
});