import { MessageType } from '@/app/api/useMessages';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import * as React from 'react';

export const MessageView = React.memo((props: { message: MessageType, me: string, opponent: string }) => {

    let name = 'Assistant';
    if (props.message.content.sender === 'incoming') {
        name = props.opponent;
    } else if (props.message.content.sender === 'outgoing') {
        name = props.me + ' (You)';
    } else {
        console.warn('Unknown sender', props.message.content.sender);
    }
    let color = 'color-neutral-900';
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
                    AS
                </AvatarFallback>
            </Avatar>
        )
    }

    return (
        <div className='flex flex-row px-[32px] py-[16px]'>
            <div className='flex-shrink-0 mr-[16px] mt-[8px]'>
                {avatar}
            </div>
            <div className='flex flex-col'>
                <span className={cn('text-base text-neutral-900 font-semibold', color)}>{name}</span>
                <span>{props.message.content.body.value}</span>
            </div>
        </div>
    )
});