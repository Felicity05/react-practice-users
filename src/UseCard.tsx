import { type User } from "./users";

export default function UserCard({ user }: { user: User }) {
  const { name, email, role } = user;

  return (
    <div className="userStyles">
      <p>
        <strong>Name:</strong> {name}
      </p>
      <p>
        <strong>Email:</strong> {email}
      </p>
      <p>
        <strong>Role:</strong> {role}
      </p>
    </div>
  );
}
