import * as React from 'react';
import styles from './CreateChat.module.css';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export const CreateChat = React.memo(() => {
    return (
        <div className={styles.container}>
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 pb-[32px]">Starting a session</h2>
            <div className={styles.section}>
                <div>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Who would participate in the session?</h4>
                    <p className="text-sm text-muted-foreground">First names are preffered, but you can write them in any form.</p>
                </div>
                <Input placeholder='First participant name' />
                <Input placeholder='Second participant name' />
            </div>
            <div className={styles.section}>
                <div>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Describe problem</h4>
                    <p className="text-sm text-muted-foreground">Explain the conflict mentioning both of a participants</p>
                </div>
                <Textarea placeholder='This is visible for everyone' className='h-[128px] resize-none' />
            </div>
            <Button>Start session</Button>
        </div>
    );
});