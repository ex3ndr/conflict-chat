import * as React from 'react';
import { MessageType, fetchMessages } from './useMessages';
import qs from 'querystring';
import { getJoinToken } from './getJoinToken';
import { Event } from './useUpdates';
import { delay } from '../utils/time';

export function useMessaging(id: string): [MessageType[] | null, boolean] {
    const [messages, setMessages] = React.useState<MessageType[] | null>(null);
    const [typing, setTyping] = React.useState(false);
    React.useEffect(() => {
        let exited = false;
        (async () => {

            // Initial load
            let msgs = (await fetchMessages(id, null)).messages.messages;
            if (exited) {
                return;
            }

            // Update state
            setMessages([...msgs]);

            function mergeMessages(added: MessageType[]) {
                let changed = false;
                for (let m of added) {

                    // Check if already exists
                    if (msgs.find(x => x.mid === m.mid)) {
                        continue;
                    }

                    // Add
                    let index = msgs.findIndex(x => x.mid > m.mid);
                    if (index === -1) {
                        msgs.push(m);
                    } else {
                        msgs.splice(index, 0, m);
                    }
                    changed = true;
                }

                // Notify about change
                if (changed) {
                    setMessages([...msgs]);
                }
            }

            // Typing indicator
            let typingTimeout: any = null;

            // Subscribe to updates
            const sse = new EventSource('https://conflict-f8894b941d1f.herokuapp.com/session/events?' + qs.stringify({ id, token: getJoinToken(id) }));
            sse.onmessage = (e) => {
                if (exited) {
                    return;
                }
                let event = JSON.parse(e.data) as Event;

                console.log('Received:', event);

                // Handle typing
                if (event.type === 'typing-ai') {
                    if (!typingTimeout) {
                        setTyping(true);
                    } else {
                        clearTimeout(typingTimeout);
                        typingTimeout = null;
                    }

                    // Reset state
                    typingTimeout = setTimeout(() => {
                        if (exited) {
                            return;
                        }
                        setTyping(false);
                        typingTimeout = null;
                    }, 4000);
                }

                // Handle new message
                if (event.type === 'update' && event.update.update === 'new') {

                    // Reset AI typing
                    if (event.update.message.sender === 'system') {
                        if (typingTimeout) {
                            clearTimeout(typingTimeout);
                            typingTimeout = null;
                            setTyping(false);
                        }
                    }

                    // Merge message
                    mergeMessages([{
                        version: 0,
                        mid: event.update.mid,
                        content: event.update.message,
                    }]);
                }
            }

            try {
                // Wait for exit
                while (!exited) {

                    // Wait for new messages
                    let msgs = (await fetchMessages(id, null)).messages.messages;
                    if (exited) {
                        return;
                    }
                    mergeMessages(msgs);

                    // Delay
                    await delay(1000);
                }
            } finally {
                sse.close();
            }
        })();
        return () => {
            exited = true;
        }
    }, []);
    return [messages, typing];
}