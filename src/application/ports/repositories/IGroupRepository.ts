import { Group } from '../../../domain/entities/Group';

export interface IGroupRepository {
    getGroups(userId: string): Promise<Group[]>;
    createGroup(groupData: { name: string; description: string; userId: string }): Promise<Group>;
    joinGroup(code: string, userId: string): Promise<void>;
    leaveGroup(groupId: string, userId: string): Promise<void>;
    getGroupDetails(groupId: string): Promise<Group>;
    getGroupMembers(groupId: string): Promise<any[]>; // TODO: Define Member entity properly
    uploadGroupImage(groupId: string, formData: FormData): Promise<void>;
    getGroupMessages(groupId: string): Promise<any[]>; // TODO: Define Message entity
    sendGroupMessage(groupId: string, userId: string, message: string): Promise<void>;
}
