import axios from 'axios';

export async function createSession(args: { nameA: string, nameB: string, description: string, repeatKey: string }) {
    const { nameA, nameB, description, repeatKey } = args;
    const response = await axios.post('https://conflict-f8894b941d1f.herokuapp.com/session/create', { nameA, nameB, description, repeatKey }, { validateStatus(status) { return status === 200 || status === 422; } });
    return response.data as { ok: false, message: string } | { ok: true, id: string };
}