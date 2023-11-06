import axios from 'axios';
import { getJoinToken } from './getJoinToken';

export async function sendMessage(args: { id: string, text: string, repeatKey: string }) {
    const response = await axios.post('https://conflict-f8894b941d1f.herokuapp.com/session/send', { id: args.id, token: getJoinToken(args.id), text: args.text, repeatKey: args.repeatKey }, { validateStatus(status) { return status === 200 || status === 422; } });
    return response.data as { ok: false, message: string } | { ok: true };
}