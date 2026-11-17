import {useEffect, useState} from "react";
import UserCard from "./UseCard";
import {User} from "./users";
import {fetchUsers} from "./api";
import {getErrorMessage} from "./errors";

type RequestState =
    | {status: 'loading'}
    | {status: 'success', data: User[] }
    | {status: 'error', message: string }

type SortDirection = 'asc' | 'desc';

export function UserList() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [retryCounter, setRetryCounter] = useState(0);
  const [requestState, setRequestState] = useState<RequestState>({status: 'loading'});

  useEffect(() => {
      let active = true;

      setRequestState({status: 'loading'});

      fetchUsers()
          .then((users) => {
              if (active) setRequestState({status: 'success', data: users});
          })
          .catch((error: unknown) => {
              if (active) setRequestState({status: 'error', message: getErrorMessage(error)});
          })

      return () => {
          active = false;
      };

  }, [retryCounter]);

  const handleChange = (value: string) => {
    setSearchValue(value);
  };

  const loadedUsers = requestState.status === "success" ? requestState.data : [];
  const uniqueRoles = Array.from(new Set(loadedUsers.map((user) => user.role)));

  const filteredUsers = loadedUsers.filter((user) =>
      user.name.toLowerCase().includes(searchValue.toLowerCase()) &&
      (selectedRole === "All Roles" || user.role === selectedRole)
  ).sort((a, b) => {
    if (sortDirection === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  return (
      <div>
        <input placeholder="Search user..." value={searchValue} aria-label="Search user"
            onChange={(event) => handleChange(event.target.value)}
        />
          <select value={selectedRole} aria-label="Select Role"
                  onChange={(event) => setSelectedRole(event.target.value)}>
              {["All Roles", ...uniqueRoles].map((role) =>
                  <option key={role} value={role}>{role}</option>)}
          </select>
          <select value={sortDirection}  aria-label="Sort by Name"
                  onChange={(event) => setSortDirection(event.target.value as SortDirection)}>
              <option value="asc">Ascending A-Z</option>
              <option value="desc">Descending Z-A</option>
          </select>

          {requestState.status === "loading" && <h2>Loading...</h2> }

          {requestState.status === "error" && <div>
              <h2>Error: {requestState.message}</h2>
              <button onClick={() => setRetryCounter((c) => c + 1)}>Try Again</button>
          </div>}

          {requestState.status === 'success' && (
              requestState.data.length === 0 ? (
                  <h2>No users found</h2>
              ) : filteredUsers.length === 0 ? (
                  <h2>No users match "{searchValue}" in {selectedRole}. Try a new search again.</h2>
              ) : (
                  <div className="card-list">
                      {filteredUsers.map((user) => <UserCard key={user.id} user={user} />)}
                  </div>
              )
          )}
      </div>
  );
}
