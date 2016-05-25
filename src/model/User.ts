export type UserId = string|number;

export class User {
    id: UserId;
    username: string;
    email: string;
    password: string;
    salt: string;
}
