import * as React from 'react';
import qs from 'querystring';
import { getJoinToken } from './getJoinToken';
import { MessageContent } from './useMessages';
import ReconnectingEventSource from "reconnecting-eventsource";

export type Event = {
    type: 'typing-ai'
} | {
    type: 'update',
    update: {
        update: 'new',
        mid: number,
        message: MessageContent
    }
}

export function useUpdates(id: string, handler: (event: Event) => void) {
    React.useEffect(() => {
        const sse = new ReconnectingEventSource('https://conflict-f8894b941d1f.herokuapp.com/session/events?' + qs.stringify({ id, token: getJoinToken(id) }));
        sse.onmessage = e => handler(JSON.parse(e.data));
        return () => {
            sse.close();
        };
    }, [id]);
}