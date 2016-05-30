export type UserId = string;

export interface User {
    id: UserId;
    email: string;
    password: string;
    salt: string;
}
