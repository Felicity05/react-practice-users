import {User, users} from "./users";

export async function fetchUsers(): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (Math.random() < 0.25) {
        throw new Error("Unable to load users");
    }

    return users.map((user) => ({ ...user }));
}