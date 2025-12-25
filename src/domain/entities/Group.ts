export interface GroupMember {
    id: string;
    name: string;
    image?: string;
    isAdmin?: boolean;
}

export interface Group {
    id: string;
    name: string;
    description: string;
    image?: string;
    members: GroupMember[];
    memberCount?: number;
    code?: string;
    createdAt?: Date;
}
