import * as React from 'react';
import { MessageType } from '@/app/api/useMessages';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { VenetianMaskIcon } from 'lucide-react';

const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

export const MessageView = React.memo((props: { message: MessageType, me: string, opponent: string, meIsA: boolean }) => {

    let name = 'Mediator';
    if (props.message.content.sender === 'incoming') {
        name = props.opponent;
    } else if (props.message.content.sender === 'outgoing') {
        name = props.me + ' (You)';
    }
    let color = '';
    if (props.message.content.sender === 'system') {
        color = 'text-orange-600';
    } else if (props.message.content.sender === 'incoming') {
        color = 'text-blue-600';
    }
    let avatar: any;
    if (props.message.content.sender === 'incoming') {
        avatar = (
            <Avatar>
                <AvatarFallback>
                    {props.opponent.slice(0, 2)}
                </AvatarFallback>
            </Avatar>
        )
    } else if (props.message.content.sender === 'outgoing') {
        avatar = (
            <Avatar>
                <AvatarFallback>
                    {props.me.slice(0, 2)}
                </AvatarFallback>
            </Avatar>
        )
    } else {
        avatar = (
            <Avatar>
                <AvatarFallback>
                    ME
                </AvatarFallback>
            </Avatar>
        )
    }

    let body = props.message.content.body.value.split(linkRegex);
    let bodyElements: any[] = [];
    body.forEach((part, index) => {
        if (index % 3 === 1) {
            const side = body[index].toLowerCase();
            const name = body[index + 1];
            if ((side === 'a' && props.meIsA) || (side === 'b' && !props.meIsA)) {
                bodyElements.push(<span className='font-bold text-blue-500'>{name}</span>);
            } else {
                bodyElements.push(<span className='font-bold'>{name}</span>);
            }
        } else if (index % 3 === 0) {
            bodyElements.push(<span>{part}</span>);
        }
    });

    return (
        <div className='flex flex-row px-[32px] py-[16px]'>
            <div className='flex-shrink-0 mr-[16px] mt-[8px]'>
                {avatar}
            </div>
            <div className='flex flex-col'>
                <div className='flex flex-row self-stretch items-center'>
                    {props.message.content.private === true && (
                        <VenetianMaskIcon className={cn(color, 'mr-[4px] mt-[1px]')} size={18} />
                    )}
                    <span className={cn('text-base font-semibold', color)}>{name}</span>
                    {props.message.content.private === true && (
                        <span className='ml-[4px] font-bold'>visible only to you</span>
                    )}
                </div>
                <span>{bodyElements}</span>
            </div>
        </div>
    )
});