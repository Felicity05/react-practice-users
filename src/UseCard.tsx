import { User } from "./users";
import {useState} from "react";

export default function UserCard({ user }: { user: User }) {
  const { name, email, role } = user;
  const [showDetails, setShowDetails] = useState(false);

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
        <button onClick={() => setShowDetails(!showDetails)} aria-expanded={showDetails}>
            {showDetails ? "Hide Details" : "Show Details"}
        </button>
        {showDetails && <p>{user.details}</p>}
    </div>
  );
}
