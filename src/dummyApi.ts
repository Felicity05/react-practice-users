import {User} from "./users";

export type UserResponse = {
    limit: number;
    skip: number;
    total: number;
    users: DummyUser[];
}

export type Role = "admin" | "moderator" | "user";

export type DummyUser = {
    id: number;
    firstName: string;
    lastName: string;
    image: string;
    email: string;
    phone: string;
    role: Role;
    university: string;
}

type FetchOptions = { signal?: AbortSignal; delayMs?: number; failStatus?: number };

export const toUser = (apiUser: DummyUser): User => {
    return {
        id: apiUser.id,
        name: `${apiUser.firstName} ${apiUser.lastName}`,
        email: apiUser.email,
        role: apiUser.role,
        details: `${apiUser.phone} -- ${apiUser.university}`,
    };
};

export const fetchDummyUsers = async ({ signal, delayMs = 0, failStatus }: FetchOptions = {}): Promise<User[]> => {
    const url = failStatus
        ? `https://dummyjson.com/http/${failStatus}?delay=${delayMs}`
        : `https://dummyjson.com/users?limit=20&delay=${delayMs}`;

    const response = await fetch(url, { signal });
    if(!response.ok) {
        throw new Error(`Failed to fetch users (HTTP ${response.status})`);
    }

    const userData: UserResponse = await response.json();

    return userData.users.map(toUser);
}