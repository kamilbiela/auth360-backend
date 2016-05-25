export type UserId = string;

export class User {
    id: UserId;
    email: string;
    password: string;
    salt: string;
}
