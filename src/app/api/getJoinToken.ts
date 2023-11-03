import { randomKey } from "../utils/randomKey";

export function getJoinToken(id: string) {
    let ex = localStorage.getItem('joinkey_' + id);
    if (ex) {
        return ex;
    } else {
        let key = randomKey();
        localStorage.setItem('joinkey_' + id, key);
        return key;
    }
}