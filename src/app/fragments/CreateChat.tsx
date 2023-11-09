import * as React from 'react';
import styles from './CreateChat.module.css';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createSession } from '../api/createSession';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { backoff } from '../utils/time';
import { randomKey } from '../utils/randomKey';

export const CreateChat = React.memo(() => {

    const navigate = useNavigate();
    const [nameA, setNameA] = React.useState(import.meta.env.DEV ? 'Cat' : '');
    const [nameB, setNameB] = React.useState(import.meta.env.DEV ? 'Dog' : '');
    const [description, setDescription] = React.useState(import.meta.env.DEV ? 'Cat wants to play inside, but Dog wants to play outside' : '');
    const [loading, setLoading] = React.useState(false);
    const doCreate = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const repeatKey = randomKey();
            const response = await backoff(() => createSession({ nameA, nameB, description, repeatKey }));
            if (response.ok) {
                navigate(`/chat/${response.id}`);
            } else {
                alert(response.message);
            }
        } finally {
            setLoading(false);
        }
    };
    const doExample = () => {
        setNameA('Cat');
        setNameB('Dog');
        setDescription('Cat wants to play inside, but Dog wants to play outside');
    }

    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 pb-[32px]">Starting a session</h2>
                <div className={styles.section}>
                    <div>
                        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Who would participate in the session?</h4>
                        <p className="text-sm text-muted-foreground">First names are preffered, but you can write them in any form.</p>
                    </div>
                    <Input placeholder='First participant name' disabled={loading} value={nameA} onChange={(e) => setNameA(e.target.value)} />
                    <Input placeholder='Second participant name' disabled={loading} value={nameB} onChange={(e) => setNameB(e.target.value)} />
                </div>
                <div className={styles.section}>
                    <div>
                        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Describe problem</h4>
                        <p className="text-sm text-muted-foreground">Explain the conflict mentioning both of a participants</p>
                    </div>
                    <Textarea placeholder='This is visible for everyone' className='h-[128px] resize-none' disabled={loading} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <Button disabled={loading} onClick={doCreate}>
                    {loading && (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)}
                    Start session
                </Button>
                <Button disabled={loading} onClick={doExample} className='mt-[16px]' variant={'ghost'}>
                    Example
                </Button>
            </div>
        </div>
    );
});