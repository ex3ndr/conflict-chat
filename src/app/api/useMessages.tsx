import axios from 'axios';
import { getJoinToken } from './getJoinToken';
import { backoff } from '../utils/time';
import { useQuery } from 'react-query';

export type MessageType = {
    version: number,
    mid: number,
    content: {
        sender: 'system' | 'incoming' | 'outgoing'
        date: number,
        body: {
            kind: 'text',
            value: string
        }
    }
};

async function fetchMessages(id: string) {
    return backoff(async () => {
        const response = await axios.post('https://conflict-f8894b941d1f.herokuapp.com/session/messages', { id, token: getJoinToken(id), after: null });
        if (response.data.ok === false) throw new Error(); // Retry
        return response.data as {
            ok: true,
            messages: {
                next: string | null,
                hasMore: boolean,
                messages: MessageType[]
            }
        }
    })
}

export function useMessages(id: string) {
    return useQuery('/chat/' + id + '/messages', () => fetchMessages(id), { refetchInterval: 1000 });
}