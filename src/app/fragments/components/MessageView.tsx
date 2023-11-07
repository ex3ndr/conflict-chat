import { MessageType } from '@/app/api/useMessages';
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

    return (
        <div className='flex flex-row px-[32px] py-[16px]'>
            <div className='w-[36px] h-[36px] rounded-[32px] mr-[16px] flex-shrink-0 bg-accent mt-[8px]' />
            <div className='flex flex-col'>
                <span className={cn('text-base text-neutral-900 font-semibold', color)}>{name}</span>
                <span>{props.message.content.body.value}</span>
            </div>
        </div>
    )
});