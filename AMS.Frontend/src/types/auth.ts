export interface User {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "Teacher" | "Student";
    exp?: number;
}

export interface AuthResponse {
    token: string;
    role: string;
}