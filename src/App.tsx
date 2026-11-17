import "./styles.css";
import { UserList } from "./UserList";
import { SignupForm } from "./signup/SignupForm";
import {useState} from "react";

export default function App() {
 const [showUsers, setShowUsers] = useState(true);

  return (
    <div className="App">
      <button onClick={() => setShowUsers(!showUsers)}>{showUsers ? "Hide Users" : "Show Users"}</button>
      {showUsers && <UserList />}
      <hr />
      <SignupForm />
      <hr />
    </div>
  );
}
