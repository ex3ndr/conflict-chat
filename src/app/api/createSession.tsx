import axios from 'axios';
import { randomKey } from '../utils/randomKey';

export async function createSession(args: { nameA: string, nameB: string, description: string }) {
    let repeatKey = randomKey();
    const { nameA, nameB, description } = args;
    const response = await axios.post('https://conflict-f8894b941d1f.herokuapp.com/session/create', { nameA, nameB, description, repeatKey }, { validateStatus(status) { return status === 200 || status === 422; } });
    return response.data as { ok: false, message: string } | { ok: true, id: string };
}