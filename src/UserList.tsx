import UserCard from "./UseCard";
import { users } from "./users";

export function UserList() {
  return (
    <div className="card-list">
      {users.map((user) => (
        <UserCard user={user} />
      ))}
    </div>
  );
}
