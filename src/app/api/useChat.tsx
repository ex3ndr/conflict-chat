import axios from 'axios';
import { useQuery } from 'react-query';
import { backoff } from '../utils/time';
import { getJoinToken } from './getJoinToken';

export type SessionState = {
    state: 'expired'
} | {
    state: 'awaiting',
    createdAt: number,
    expiresAt: number,
    nameA: string,
    nameB: string,
    joinedA: boolean,
    joinedB: boolean,
    description: string,
    joined: 'none' | 'a' | 'b'
} | {
    state: 'starting',
    createdAt: number,
    expiresAt: number,
    nameA: string,
    nameB: string,
    description: string,
    joined: 'none' | 'a' | 'b'
} | {
    state: 'started',
    createdAt: number,
    expiresAt: number,
    nameA: string,
    nameB: string,
    description: string,
    mid: number,
    joined: 'none' | 'a' | 'b'
}

async function fetchChat(id: string) {
    return backoff(async () => {
        const response = await axios.post('https://conflict-f8894b941d1f.herokuapp.com/session/state', { id, token: getJoinToken(id) });
        if (response.data.ok === false) throw new Error(); // Retry
        return response.data.session as SessionState;
    })
}

export function useChat(id: string) {
    return useQuery('/chat/' + id, () => fetchChat(id), { refetchInterval: 1000 });
}