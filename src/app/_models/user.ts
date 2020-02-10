export class User {
    id: number;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    role: string;
    // token: string; //Use with live api
    token?: string; //Use with fake backend
}