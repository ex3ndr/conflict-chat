import axios from 'axios';
import { getJoinToken } from './getJoinToken';

export async function joinSession(args: { id: string, side: 'a' | 'b' }) {
    let { id, side } = args;
    const response = await axios.post('https://conflict-f8894b941d1f.herokuapp.com/session/join', { id, token: getJoinToken(id), side }, { validateStatus(status) { return status === 200 || status === 422; } });
    return response.data as { ok: false, message: string } | { ok: true };
}