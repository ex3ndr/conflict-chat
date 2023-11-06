import { MessageType } from '@/app/api/useMessages';
import * as React from 'react';

export const MessageView = React.memo((props: { message: MessageType, me: string, opponent: string }) => {

    let name = 'Assistant';
    if (props.message.content.sender === 'incoming') {
        name = props.opponent;
    } else if (props.message.content.sender === 'outgoing') {
        name = "You";
    }

    return (
        <div className='flex flex-row px-[32px] py-[16px]'>
            <div className='w-[36px] h-[36px] rounded-[32px] bg-black mr-[16px]' />
            <div className='flex flex-col'>
                <span>{name}</span>
                <span>{props.message.content.body.value}</span>
            </div>
        </div>
    )
});