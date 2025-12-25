export interface User {
    id: number;
    name: string;
    email: string;
    identityCard: string;
    address: string;
    birthDate: string;
    status?: 'active' | 'inactive' | 'deleted';
    helpCount?: number;
    profileImage?: string;
    // We intentionally omit password_hash for security in the domain model
}
