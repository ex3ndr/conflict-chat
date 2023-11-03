import * as React from 'react';
import { useChat } from '../api/useChat';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from '@/components/ui/button';
import { randomKey } from '../utils/randomKey';

export const Chat = React.memo(() => {

    // Load chat
    const id = useParams().id as string;
    const chat = useChat(id);
    if (!chat.data) {
        return (<ChatLoading />);
    }
    const session = chat.data;
    if (session.state === 'expired') {
        return (<ChatExpired />);
    }
    if (session.state === 'awaiting') {
        return (<ChatJoin
            id={id}
            nameA={session.nameA}
            nameB={session.nameB}
            description={session.description}
            joinedA={session.joinedA}
            joinedB={session.joinedB}
        />);
    }
    if (session.state === 'starting') {
        return (<ChatAwaitStart />);
    }

    return null;
});

const ChatJoin = React.memo((props: { id: string, nameA: string, nameB: string, description: string, joinedA: boolean, joinedB: boolean }) => {

    // Load join key
    const joinKey = React.useMemo(() => {
        let ex = localStorage.getItem('joinkey_' + props.id);
        if (ex) {
            return ex;
        } else {
            let key = randomKey();
            localStorage.setItem('joinkey_' + props.id, key);
            return key;
        }
    }, [props.id]);
    const [joined, setJoined] = React.useState<'a' | 'b' | 'spectrator' | null>(localStorage.getItem('joined_' + props.id) as 'a' | 'b' | 'spectrator' | null);
    const [loading, setLoading] = React.useState(false);
    const join = (arg: 'a' | 'b' | 'spectrator') => {

    };

    return (
        <div className='flex flex-grow justify-center items-center'>
            <div className='flex flex-col items-center'>
                <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 mb-[16px]">Mediation Session</h2>
                <blockquote className="border-l-2 pl-6 italic mb-[48px]">
                    {props.description}
                </blockquote>
                {joined === null && (
                    <>
                        <div className='flex flex-row gap-[8px] mb-[16px]'>
                            <Button disabled={loading} onClick={() => join('a')}>Join as {props.nameA}</Button>
                            <Button disabled={loading} onClick={() => join('b')}>Join as {props.nameB}</Button>
                        </div>
                        {/* <Button variant="ghost" disabled={loading} onClick={() => join('spectrator')}>Join as spectrator</Button> */}
                    </>
                )}
            </div>
        </div>
    )
});

const ChatAwaitStart = React.memo(() => {
    return (
        <div className='flex flex-grow justify-center items-center'>
            <Loader2 className="mr-2 h-[64px] w-[64px] animate-spin mb-[16px]" />
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-[16px]">
                Awaiting AI agent to join...
            </h3>
        </div>
    );
});

const ChatLoading = React.memo(() => {
    return (
        <div className='flex flex-grow justify-center items-center'>
            <Loader2 className="mr-2 h-[64px] w-[64px] animate-spin" />
        </div>
    );
});

const ChatExpired = React.memo(() => {
    const navigate = useNavigate();
    return (
        <div className='flex flex-grow justify-center items-center flex-col'>
            <AlertCircle className='h-[48px] w-[48px] mb-[16px]' />
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-[16px]">
                This chat expired
            </h3>
            <Button onClick={() => navigate('/')}>Start new</Button>
        </div>
    );
});