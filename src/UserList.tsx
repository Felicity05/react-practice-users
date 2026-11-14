import {useEffect, useState} from "react";
import UserCard from "./UseCard";
import {User, users} from "./users";
import {fetchUsers} from "./api";

export function UserList() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [sortByName, setSortByName] = useState("asc");
  const [fetchedUsers, setFetchedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCounter, setRetryCounter] = useState(0);

  /*
    1. Each effect execution creates its own active variable, initially true.
    2. The request starts. Every callback checks that execution’s flag before updating the state.
    3. React calls the returned cleanup function when the component unmounts or before rerunning the effect because retryCounter changed.
    4. Cleanup sets that execution’s active to false. Its request can still finish, but its callbacks won’t update the state.

    A new effect execution gets a separate flag, so cleaning up the previous request doesn’t invalidate the new one.
    Your Retry button can now just trigger another attempt, since the effect clears the error:

    <button onClick={() => setRetryCounter((previous) => previous + 1)}>
      Try Again
    </button>

    The cleanup invalidates the request’s callbacks; it doesn’t reset the component state or cancel the request.
    For this simulated API, ignoring its result is sufficient.
  * */

  useEffect(() => {
      let active = true;

      setLoading(true);
      setError(null);

      fetchUsers().then(
          (users) => {
              if (active) {
                  setFetchedUsers(users);
              }
          })
          .catch((error: unknown) => {
              if (active) {
                  setError(error instanceof Error
                      ? error
                      : new Error("Unable to load users")
                  )
              }
          })
          .finally(() => {
              if (active) {
                  setLoading(false);
              }
          });

      return () => {
          active = false;
      };

  }, [retryCounter]);

  const handleChange = (value: string) => {
    setSearchValue(value);
  };

  const uniqueRoles = Array.from(new Set(fetchedUsers.map((user) => user.role)));

  const filteredUsers = fetchedUsers.filter((user) =>
      user.name.toLowerCase().includes(searchValue.toLowerCase()) &&
      (selectedRole === "All Roles" || user.role === selectedRole)
  ).sort((a, b) => {
    if (sortByName === "asc") {
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
          <select value={sortByName}  aria-label="Sort by Name"
                  onChange={(event) => setSortByName(event.target.value)}>
              <option value="asc">Ascending A-Z</option>
              <option value="desc">Descending Z-A</option>
          </select>
          {!loading && !error && fetchedUsers.length === 0 && <h2>No users found</h2>}

          {!loading && error && <div>
              <h2>Error: {error.message}</h2>
              <button onClick={() => {
                  setRetryCounter(retryCounter + 1)
                  setError(null)
              }}>Try Again</button>
          </div>}

          {loading  && !error && <h2>Loading...</h2> }

          {!loading && !error && fetchedUsers.length > 0 && <div className="card-list">
              {filteredUsers.length === 0 ?
                  <h1>No users found that match your search criteria "{searchValue} - {selectedRole}". Try a new search again.</h1>
                  : filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
              ))}
            </div>}
      </div>
  );
}
