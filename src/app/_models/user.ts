export class User {
    id: number;
    user_id?: number;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    role: string;
    user_type?: string;
    // token: string; //Use with live api
    token?: string; //Use with fake backend
}