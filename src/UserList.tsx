import {useEffect, useState} from "react";
import UserCard from "./UseCard";
import {User} from "./users";
import {getErrorMessage} from "./errors";
import {fetchDummyUsers} from "./dummyApi";

type RequestState =
    | {status: 'loading'}
    | {status: 'success', data: User[], source: string }
    | {status: 'error', message: string, source: string }

type SortDirection = 'asc' | 'desc';

// Race-condition practice: odd Refresh clicks start request A (slow), even clicks start B (fast).
// Set to true to make the slow request A fail with HTTP 500.
const SLOW_REQUEST_FAILS = false;

export function UserList() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [retryCounter, setRetryCounter] = useState(0);
  const [requestState, setRequestState] = useState<RequestState>({status: 'loading'});

  useEffect(() => {
      let active = true;
      const controller = new AbortController();

      const isSlow = retryCounter % 2 === 1;          // odd clicks = A
      const name = isSlow ? "A (slow)" : "B (fast)";
      console.log(`start ${name}`);

      setRequestState({status: 'loading'});

      fetchDummyUsers({
          signal: controller.signal,
          delayMs: isSlow ? 2000 : 200,
          failStatus: isSlow && SLOW_REQUEST_FAILS ? 500 : undefined,
      })
          .then((users) => {
              console.log(`arrived ${name} (active: ${active})`);
              if (active) setRequestState({status: 'success', data: users, source: name});
          })
          .catch((error: unknown) => {
              console.log(`failed ${name} (active: ${active})`, getErrorMessage(error));
              if (active) setRequestState({status: 'error', message: getErrorMessage(error), source: name});
          })

      //Cleanup function: cancel the pending request and ignore its result.
      return () => {
          controller.abort(); //cancels the network request if there's an error
          active = false; //protects state from any callback that still runs and sets the request as inactive
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
          <button onClick={() => setRetryCounter((prevCounter) => prevCounter + 1)}>Refresh {retryCounter}</button>
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

          {requestState.status !== "loading" && (
              <p style={{fontSize: "20px", fontWeight: "bold", backgroundColor: "#aa3bff", color: "white", padding: "10px", textAlign: "center"}}>
                  Screen shows request {requestState.source} ({requestState.status})
              </p>
          )}

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
