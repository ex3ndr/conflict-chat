import * as React from 'react';
import { useChat } from '../api/useChat';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from '@/components/ui/button';
import { joinSession } from '../api/joinSession';
import { Header } from '@/components/header';
import { useMessages } from '../api/useMessages';
import { MessageView } from './components/MessageView';
import { backoff } from '../utils/time';
import { Textarea } from '@/components/ui/textarea';
import { randomKey } from '../utils/randomKey';
import { sendMessage } from '../api/sendMessage';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

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
            joined={session.joined}
            reload={chat.refetch}
        />);
    }
    if (session.state === 'starting') {
        return (<ChatAwaitStart />);
    }

    return <ChatView
        id={id}
        nameMe={session.joined === 'a' ? session.nameA : session.nameB}
        nameOpponent={session.joined === 'a' ? session.nameB : session.nameA}
        meIsA={session.joined === 'a'}
        description={session.description}
    />;
});

const ChatMessages = React.memo((props: { id: string, me: string, opponent: string, meIsA: boolean }) => {
    const messages = useMessages(props.id);

    if (!messages.data) {
        return (
            <div className='flex flex-grow justify-center items-center'>
                <Loader2 className="mr-2 h-[64px] w-[64px] animate-spin" />
            </div>
        );
    }
    return (
        <div className='flex flex-1 flex-col-reverse overflow-y-scroll'>
            {[...messages.data.messages.messages].reverse().map((v) => (
                <MessageView key={'msg-' + v.mid} message={v} me={props.me} opponent={props.opponent} meIsA={props.meIsA} />
            ))}
        </div>
    );
});

const ChatSend = React.memo((props: { id: string }) => {
    const [text, setText] = React.useState('');
    const [sending, setSending] = React.useState(false);
    const [sendPrivate, setSendPrivate] = React.useState(false);
    const ref = React.useRef<HTMLTextAreaElement>(null);
    const doSend = () => {
        if (sending) return;
        let trimmed = text.trim();
        if (trimmed.length === 0) return;
        (async () => {
            setSending(true);
            try {

                // Send message
                const repeatKey = randomKey();
                await backoff(() => sendMessage({ id: props.id, repeatKey, private: sendPrivate, text: trimmed }));

                // Clear text
                setText('');
                setSending(false);
            } finally {
                setSending(false);
            }
        })();
    };
    const onKeypress = (e: React.KeyboardEvent) => {
        if (e.key == 'Enter' && !e.shiftKey) {
            doSend();
        }
    };
    React.useLayoutEffect(() => {
        if (ref.current && !sending) {
            ref.current.focus();
        }
    }, [sending]);

    return (
        <div className='flex flex-row gap-[8px] min-h-[64px] mx-[32px] max-h-[192px] flex-grow-1 items-center py-[8px] mb-[32px]'>
            <div className='flex flex-col flex-grow'>
                <Textarea
                    className='min-h-[40px] h-auto overflow-hidden'
                    ref={ref}
                    placeholder='Type your message'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={onKeypress}
                    disabled={sending}
                    onSubmit={doSend}
                    rows={1}
                />
                <div className="flex items-center space-x-2 h-[36px] ml-[4px]">
                    <Checkbox checked={sendPrivate} onCheckedChange={(e) => setSendPrivate(e === true)} />
                    <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Private message
                    </label>
                </div>
            </div>
            <Button
                className='mb-[36px]'
                disabled={sending}
                onClick={doSend}
            >
                Send
            </Button>
        </div>
    );
});

const ChatView = React.memo((props: { id: string, nameMe: string, nameOpponent: string, description: string, meIsA: boolean }) => {
    const navigate = useNavigate();
    const resetButton = (
        <Button onClick={() => navigate('/')}>
            Start again
        </Button>
    );
    return (
        <>
            <Header title={'Mediation of ' + props.nameMe + ' and ' + props.nameOpponent} right={resetButton} />
            <ChatMessages id={props.id} me={props.nameMe} opponent={props.nameOpponent} meIsA={props.meIsA} />
            <ChatSend id={props.id} />
        </>
    );
});

const ChatJoin = React.memo((props: { id: string, nameA: string, nameB: string, description: string, joinedA: boolean, joinedB: boolean, joined: 'none' | 'a' | 'b', reload: () => Promise<any> }) => {

    const toaster = useToast();

    // Load join key
    const [loading, setLoading] = React.useState(false);
    const join = async (arg: 'a' | 'b') => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await joinSession({ id: props.id, side: arg });
            if (response.ok) {
                await props.reload();
            } else {
                alert(response.message);
            }
        } finally {
            setLoading(false);
        }
    };
    const inviteLink = window.location.protocol + '//' + window.location.host + '/chat/' + props.id;
    const doCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        toaster.toast({ description: 'Copied to clipboard' });
    };

    return (
        <div className='flex flex-grow justify-center items-center'>
            <div className='flex flex-col items-center'>
                <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 mb-[24px]">Mediation Session</h2>
                <blockquote className="border-l-2 pl-6 italic mb-[32px]">
                    {props.description}
                </blockquote>
                {props.joined === 'none' && (
                    <>
                        <div className='flex flex-row gap-[8px] h-[48px] items-center justify-center'>
                            <Button disabled={loading || props.joinedA} onClick={() => join('a')}>Join as {props.nameA}</Button>
                            <Button disabled={loading || props.joinedB} onClick={() => join('b')}>Join as {props.nameB}</Button>
                        </div>
                    </>
                )}
                {props.joined !== 'none' && (
                    <div className='flex flex-row gap-[8px] h-[48px] items-center justify-center'>
                        <Loader2 className="h-[16px] w-[16px] animate-spin" />
                        <p>Awaiting {props.joined === 'a' ? props.nameB : props.nameA} to join session...</p>
                    </div>
                )}
                <h4 className='scroll-m-20 text-xl font-semibold tracking-tight mt-[48px] mb-[16px]'>Inivitation link</h4>
                <div className='flex flex-row self-stretch gap-[16px]'>
                    <Input value={inviteLink} onFocus={(e) => e.target.select()} />
                    <Button onClick={doCopy}>Copy</Button>
                </div>
            </div>
        </div>
    )
});

const ChatAwaitStart = React.memo(() => {
    return (
        <div className='flex flex-grow justify-center items-center flex-col'>
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