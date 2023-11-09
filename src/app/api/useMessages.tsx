import axios from 'axios';
import { getJoinToken } from './getJoinToken';
import { backoff } from '../utils/time';
import { useQuery } from 'react-query';

export type MessageType = {
    version: number,
    mid: number,
    content: MessageContent
};

export type MessageContent = {
    sender: 'system' | 'incoming' | 'outgoing'
    date: number,
    private?: boolean,
    body: {
        kind: 'text',
        value: string
    }
}

export async function fetchMessages(id: string, after: string | null) {
    return backoff(async () => {
        const response = await axios.post('https://conflict-f8894b941d1f.herokuapp.com/session/messages', { id, token: getJoinToken(id), after });
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
    return useQuery('/chat/' + id + '/messages', () => fetchMessages(id, null), { refetchInterval: 1000 });
}